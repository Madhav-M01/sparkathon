# Sparkathon - Walmart Recommendation System

A modern, AI-powered e-commerce platform built for the Sparkathon hackathon. This full-stack application provides intelligent product recommendations using machine learning algorithms and offers a seamless shopping experience.

## 🚀 Features

### Frontend (React + Vite)
- **Modern E-commerce UI**: Clean, responsive design with Tailwind CSS
- **Product Management**: Browse products, view details, search, and filter by categories
- **Shopping Cart**: Add/remove items with persistent cart functionality
- **User Profile**: Personalized user experience and order history
- **AI Chat Widget**: Interactive chat support powered by OpenAI
- **Smooth Animations**: Enhanced UX with Framer Motion
- **Responsive Design**: Works seamlessly across all devices

### Backend (FastAPI + ML)
- **Recommendation Engine**: 
  - TF-IDF vectorization for content-based filtering
  - Cosine similarity for product recommendations
  - K-means clustering for user segmentation
- **RESTful API**: Fast and efficient endpoints for all e-commerce operations
- **WebSocket Support**: Real-time chat functionality
- **AI Integration**: OpenAI/GitHub Models integration for intelligent features
- **CORS Configuration**: Secure cross-origin resource sharing

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - High-performance Python web framework
- **Pandas** - Data manipulation and analysis
- **Scikit-learn** - Machine learning algorithms
- **OpenAI API** - AI-powered features
- **Pickle** - Model serialization
- **Pydantic** - Data validation and settings management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5176`

### Backend Setup
```bash
cd backend/fastapi
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`

### Environment Variables
Create a `.env` file in the `backend/fastapi` directory:
```env
GITHUB_TOKEN=your_github_token_here
# Add other environment variables as needed
```

## 🎯 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product by ID
- `GET /search` - Search products
- `GET /categories/{category}` - Get products by category

### Recommendations
- `POST /recommendations` - Get personalized recommendations
- `POST /cart-recommendations` - Get cart-based recommendations

### Chat
- `WebSocket /chat` - Real-time chat support

## 🤖 Machine Learning Features

### Recommendation Algorithm
1. **Content-Based Filtering**: Uses TF-IDF vectorization on product descriptions
2. **Similarity Calculation**: Cosine similarity to find similar products
3. **User Clustering**: K-means clustering for user segmentation
4. **Personalization**: Recommendations based on user behavior and cart items

### Model Files
- `recommendation_models.pkl` - Serialized ML models
- `model.ipynb` - Jupyter notebook for model development and training

## 🏗️ Project Structure

```
sparkathon/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── fastapi/            # FastAPI backend
│   │   ├── main.py         # Main application file
│   │   ├── model.ipynb     # ML model development
│   │   └── recommendation_models.pkl
│   └── jsbackend/          # Alternative JS backend
└── README.md
```

## 🔧 Development

### Running in Development Mode
1. Start the backend: `cd backend/fastapi && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:5176` in your browser

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend/fastapi
# Deploy using your preferred method (Docker, Heroku, etc.)
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run lint
```

### Backend
```bash
cd backend/fastapi
python -m pytest  # If tests are available
```

## 🚀 Features Roadmap

- [ ] User authentication and authorization
- [ ] Payment gateway integration
- [ ] Advanced recommendation algorithms
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of the Sparkathon hackathon. Please check with organizers for specific licensing terms.

## 📞 Support

For questions or support, please contact the development team or open an issue in this repository.

---

Built with ❤️ for Sparkathon 2024
