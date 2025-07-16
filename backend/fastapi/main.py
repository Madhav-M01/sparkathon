import os
import pickle
import re
import logging
import asyncio
import json
from enum import Enum
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import pandas as pd
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- FastAPI App Initialization ---
app = FastAPI(title="Walmart Recommendation System", version="1.1.0")

# --- CORS Configuration ---
# Allows frontend applications from any origin to access this API.
# In production, specify exact origins for security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # WARNING: For production, change to specific origins, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# --- OpenAI Client Setup ---
# NOTE: This client is configured for GitHub's model inference service.
# To use the official OpenAI API, change the base_url and use your OpenAI API key.
# e.g., client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
client = None
try:
    from openai import OpenAI
    github_token = os.environ.get("GITHUB_TOKEN")
    if github_token:
        client = OpenAI(
            base_url="https://models.github.ai/inference",
            api_key=github_token,
        )
        logger.info("OpenAI client initialized for GitHub Model Inference.")
    else:
        logger.warning("GITHUB_TOKEN not found in environment variables. OpenAI client will not be available.")
except ImportError:
    logger.warning("OpenAI client (openai library) not installed. Chat features relying on it will not work.")
except Exception as e:
    logger.error(f"Error initializing OpenAI client: {e}")

# --- Global Recommendation System Assets ---
df = None
tfidf = None
tfidf_matrix = None
cosine_sim = None
kmeans = None
is_model_loaded = False

# Load pickled recommendation system
try:
    with open("recommendation_models.pkl", "rb") as f:
        assets = pickle.load(f)
        df = assets.get("df")
        tfidf = assets.get("tfidf")
        tfidf_matrix = assets.get("tfidf_matrix")
        cosine_sim = assets.get("cosine_sim")
        kmeans = assets.get("kmeans")
    if df is not None and not df.empty:
        is_model_loaded = True
        logger.info("Recommendation models loaded successfully from recommendation_models.pkl")
    else:
        logger.warning("recommendation_models.pkl loaded but 'df' is empty or missing. Falling back to dummy data.")
except FileNotFoundError:
    logger.error("recommendation_models.pkl not found. Falling back to dummy data.")
except Exception as e:
    logger.error(f"Failed to load recommendation model from pickle: {e}. Falling back to dummy data.")

# Fallback/Dummy Data if models aren't loaded or are incomplete
if not is_model_loaded:
    logger.info("Creating dummy data for recommendation system.")
    data = {
        'ProductID': [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
        'ProductName': ['Blue Denim Jeans', 'Casual T-Shirt', 'Leather Sneakers', 'Sport Watch', 'Classic Dress Shirt',
                        'Running Shoes', 'Smartwatch Pro', 'Summer Dress', 'Silver Necklace', 'Formal Trousers'],
        'category': ['Clothing', 'Clothing', 'Shoes', 'Watches', 'Clothing',
                     'Shoes', 'Watches', 'Clothing', 'Accessories', 'Clothing'],
        'Subcategory': ['Jeans', 'T-Shirts', 'Sneakers', 'Analog', 'Shirts',
                        'Athletic', 'Digital', 'Dresses', 'Jewelry', 'Pants'],
        'Price': [45.99, 19.99, 79.99, 120.00, 35.00,
                  90.00, 299.99, 55.00, 25.00, 49.99],
        'Rating': [4.5, 4.2, 4.7, 4.0, 4.1,
                   4.6, 4.8, 4.3, 3.9, 4.0],
        'reviews_count': [300, 150, 220, 90, 180,
                          250, 350, 110, 50, 130],
        'gender': ['Men', 'Unisex', 'Unisex', 'Unisex', 'Men',
                   'Unisex', 'Unisex', 'Women', 'Unisex', 'Men'],
        'discounted_price': [40.00, 18.00, 70.00, 100.00, 30.00,
                             85.00, 270.00, 50.00, 22.00, 45.00]
    }
    df = pd.DataFrame(data)
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    df['description_for_tfidf'] = df['ProductName'] + ' ' + df['category'] + ' ' + df['Subcategory']
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['description_for_tfidf'])
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    is_model_loaded = True # Mark as loaded with dummy data

# --- Enums and Pydantic Models for Request/Response ---

class RecommendationReason(str, Enum):
    CART_BASED = "based on items in your cart"
    CATEGORY_BASED = "based on your interest in categories"
    BUDGET_BASED = "products within your budget"
    POPULAR = "popular choices"
    GENERAL = "general recommendations"

class Product(BaseModel):
    ProductID: int
    ProductName: str
    category: str
    Rating: Optional[float] = None
    Price: Optional[float] = None
    gender: Optional[str] = None
    reviews_count: Optional[int] = None

class RecommendRequest(BaseModel):
    product_id: int
    top_n: Optional[int] = Field(default=5, gt=0, le=50) # Example validation

class SmartRecommendRequest(BaseModel):
    message: str
    user_id: Optional[str] = None
    cart_product_ids: Optional[List[int]] = None
    preferences: Optional[Dict[str, Any]] = None
    context: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Product]
    message: str
    reason: str
    detected_intents: List[str]
    extracted_preferences: Dict[str, Any]

# --- Helper Functions for Recommendation Logic ---

def recommend_content(product_id: int, top_n: int = 5) -> List[Dict[str, Any]]:
    if not is_model_loaded or df.empty or cosine_sim is None:
        logger.warning("Content-based recommendation model not ready.")
        return []
    if product_id not in df['ProductID'].values:
        logger.info(f"Product ID {product_id} not found.")
        return []
    index = df[df['ProductID'] == product_id].index[0]
    sim_scores = sorted(list(enumerate(cosine_sim[index])), key=lambda x: x[1], reverse=True)[1:top_n + 1]
    similar_indices = [i[0] for i in sim_scores]
    return df.iloc[similar_indices].to_dict(orient='records')

def recommend_popular(top_n: int = 5, by: str = 'Rating') -> List[Dict[str, Any]]:
    if not is_model_loaded or df.empty:
        logger.warning("DF not loaded for popular recommendation.")
        return []
    sort_col = by if by in df.columns and pd.api.types.is_numeric_dtype(df[by]) else 'reviews_count'
    return df.sort_values(by=sort_col, ascending=False).head(top_n).to_dict(orient='records')

# ... (other recommendation functions like recommend_by_rule, recommend_from_cluster remain the same) ...

def recommend_by_category(categories: List[str], top_n: int = 10) -> List[Dict[str, Any]]:
    if not is_model_loaded or df.empty:
        logger.warning("DF not loaded for category-based recommendation.")
        return []
    filtered = df[df['category'].str.lower().isin([c.lower() for c in categories])]
    return filtered.sort_values(by='Rating', ascending=False).head(top_n).to_dict(orient='records')

def extract_intent_from_message(message: str) -> (List[str], Dict[str, Any]):
    message_lower = message.lower()
    intents = []
    prefs = {}
    # This logic can be enhanced with LLM-based entity extraction for more robustness
    patterns = {
        "recommendation": ["recommend", "suggest", "what should i buy", "looking for"],
        "cart_based": ["cart", "similar to", "like this", "based on"],
        "category_clothing": ["clothing", "shirt", "dress", "jeans"],
        "category_shoes": ["shoes", "sneakers", "boots"],
        "budget": ["budget", "cheap", "expensive", "under", "price", "cost"],
        "gender": ["men", "women", "male", "female", "unisex"]
    }
    for intent_key, keywords in patterns.items():
        if any(keyword in message_lower for keyword in keywords):
            intents.append(intent_key)
    if m := re.search(r'under\s*[\$€₹]?(\d+)', message_lower):
        prefs['budget'] = int(m.group(1))
    if 'men' in message_lower or 'male' in message_lower: prefs['gender'] = 'Men'
    elif 'women' in message_lower or 'female' in message_lower: prefs['gender'] = 'Women'
    detected_categories = [cat.capitalize() for intent, cat in [("category_clothing", "Clothing"), ("category_shoes", "Shoes")] if intent in intents]
    if detected_categories:
        prefs['categories'] = detected_categories
        intents = [i for i in intents if not i.startswith('category_')]
        intents.append('category_based')
    return intents, prefs

def create_smart_prompt(message: str, recommendations: List[Dict[str, Any]], reason: str) -> str:
    product_names = [p.get("ProductName", "Unknown") for p in recommendations]
    recommendation_list_str = ""
    if product_names:
        recommendation_list_str = f"Here are some product recommendations for you: {', '.join(product_names[:5])}. "
    else:
        recommendation_list_str = "No specific product recommendations were found at this moment. "

    return f"""
    You are a friendly and helpful Walmart shopping assistant.
    Customer's Message: "{message}"
    {recommendation_list_str}These recommendations are {reason}.
    Based on this, craft a natural, conversational response under 150 words.
    Acknowledge their query, briefly mention the recommendations if any, and encourage further interaction.
    """

# --- API Endpoints ---

@app.get("/")
async def read_root():
    return {"message": "Walmart Recommendation System API is running!", "model_loaded": is_model_loaded}

# ... (other /recommend endpoints like /content, /popular, /rule, /cluster remain the same) ...

@app.post("/smart-recommend", response_model=RecommendationResponse)
async def smart_recommend_api(request: SmartRecommendRequest):
    logger.info(f"Incoming smart-recommend request from user {request.user_id}: '{request.message}'")
    intents, prefs = extract_intent_from_message(request.message)
    logger.info(f"Detected intents: {intents}, Extracted preferences: {prefs}")

    recs_list: List[Dict[str, Any]] = []
    reason = RecommendationReason.GENERAL

    if request.cart_product_ids and "cart_based" in intents:
        for pid in request.cart_product_ids:
            recs_list.extend(recommend_content(pid, top_n=prefs.get("quantity", 5)))
        if recs_list:
            reason = RecommendationReason.CART_BASED
            # Deduplicate
            recs_list = list({p['ProductID']: p for p in recs_list}.values())[:prefs.get("quantity", 5)]

    if not recs_list and "category_based" in intents and 'categories' in prefs:
        recs_list = recommend_by_category(prefs['categories'], top_n=prefs.get("quantity", 5))
        if recs_list:
            reason = RecommendationReason.CATEGORY_BASED

    if not recs_list and "budget" in intents and 'budget' in prefs:
        budget = prefs["budget"]
        filtered_by_budget = df[df['discounted_price'] <= budget].sort_values(by="Rating", ascending=False)
        if 'gender' in prefs:
            filtered_by_budget = filtered_by_budget[filtered_by_budget['gender'] == prefs['gender']]
        recs_list = filtered_by_budget.head(prefs.get("quantity", 5)).to_dict(orient="records")
        if recs_list:
            reason = RecommendationReason.BUDGET_BASED
    
    if not recs_list:
        recs_list = recommend_popular(top_n=prefs.get("quantity", 5))
        reason = RecommendationReason.POPULAR

    chatbot_prompt = create_smart_prompt(request.message, recs_list, reason.value)
    ai_response_content = "I'm sorry, I'm unable to provide a response at the moment."

    if client:
        try:
            # NOTE: This is a non-streaming call. The WebSocket uses the streaming version.
            response = client.chat.completions.create(
                model="openai/gpt-4o-mini",
                messages=[{"role": "system", "content": chatbot_prompt}],
                temperature=0.7, max_tokens=150
            )
            ai_response_content = response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}")
            ai_response_content = "My AI brain is experiencing some issues. Please try again later!"
    else:
        ai_response_content = f"Hello! Based on your message, I found some {reason.value} for you."
    
    return RecommendationResponse(
        recommendations=[Product(**p) for p in recs_list],
        message=ai_response_content,
        reason=reason.value,
        detected_intents=intents,
        extracted_preferences=prefs
    )

# --- WebSocket Endpoint for Real-time Chat ---
@app.websocket("/ws/{user_id}")
async def websocket_chat_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    logger.info(f"WebSocket connection established for user: {user_id}")

    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message")
            
            if not user_message:
                await websocket.send_json({"role": "assistant", "type": "error", "content": "Empty message received."})
                continue

            # First, get recommendations using the existing logic
            reco_request = SmartRecommendRequest(message=user_message, user_id=user_id)
            reco_response = await smart_recommend_api(reco_request)

            # Now, generate a conversational response using a stream for real-time feel
            chatbot_prompt = create_smart_prompt(user_message, reco_response.recommendations, reco_response.reason)
            
            if client:
                stream = client.chat.completions.create(
                    model="openai/gpt-4o-mini",
                    messages=[{"role": "system", "content": chatbot_prompt}],
                    temperature=0.7,
                    max_tokens=150,
                    stream=True
                )
                
                full_ai_response = ""
                for chunk in stream:
                    token = chunk.choices[0].delta.content or ""
                    if token:
                        await websocket.send_json({"role": "assistant", "type": "token", "content": token})
                        full_ai_response += token
                
                # Send the final consolidated message and recommendation data
                await websocket.send_json({
                    "role": "assistant",
                    "type": "end",
                    "content": full_ai_response.strip(),
                    "recommendations": [p.model_dump() for p in reco_response.recommendations],
                    "reason": reco_response.reason,
                    "detected_intents": reco_response.detected_intents,
                    "extracted_preferences": reco_response.extracted_preferences
                })
            else:
                # Fallback for when the AI client is not available
                fallback_message = f"Based on your request, I found some {reco_response.reason}."
                await websocket.send_json({"role": "assistant", "type": "token", "content": fallback_message})
                await websocket.send_json({
                    "role": "assistant",
                    "type": "end",
                    "content": fallback_message,
                    "recommendations": [p.model_dump() for p in reco_response.recommendations],
                    "reason": reco_response.reason
                })

    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}", exc_info=True)
    finally:
        logger.info(f"WebSocket connection closed for user: {user_id}")
        # Ensure the websocket is closed gracefully
        try:
            await websocket.close()
        except RuntimeError:
            pass

@app.get("/stats")
def get_system_stats():
    return {
        {"message": "Walmart Recommendation System API is running!", "model_loaded": is_model_loaded}
    }

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Walmart Recommendation System FastAPI application...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
