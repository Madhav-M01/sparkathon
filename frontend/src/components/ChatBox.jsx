import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShoppingCart, Star, Shirt, Watch, Zap, MessageCircle, X, Plus, Trash2, AlertCircle, TrendingUp, Mic } from 'lucide-react';

const FashionRecommendationSystem = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your personal fashion assistant. I can help you find the perfect clothing, watches, and shoes based on your style. What can I help you find today?",
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userId, setUserId] = useState('user-101'); // Default user ID, make it a string as per backend
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [systemStats, setSystemStats] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = 'https://sparkathon-1-brxa.onrender.com'; // Ensure this matches your backend's address

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadSystemStats();
    // Initially load some recommendations for the recommendation tab
    getDirectRecommendations("show popular items");
  }, []);

  // --- API Calls ---
  const loadSystemStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSystemStats(data);
    } catch (error) {
      console.error('Error loading system stats:', error);
      setError('Failed to load system statistics.');
    }
  };

  const sendSmartMessage = async (messageContent) => {
    const finalMessage = messageContent || inputMessage;
    if (!finalMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: finalMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/smart-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          user_id: userId || null, // Backend expects a string or null
          cart_product_ids: cartItems.map(item => item.ProductID),
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.message || "Here are your recommendations!",
        timestamp: new Date(),
        recommendations: data.recommendations || [],
        reason: data.reason,
        intents: data.detected_intents,
      };

      setMessages(prev => [...prev, botMessage]);
      // Also update the recommendations tab with the new data
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessageText = `Failed to connect to recommendation service: ${error.message}. Please ensure the backend is running.`;
      setError(errorMessageText);
      const errorMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDirectRecommendations = async (message = "show popular items") => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/smart-recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          user_id: userId || null,
          cart_product_ids: cartItems.map(item => item.ProductID),
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      }

    } catch (error) {
      console.error('Error getting direct recommendations:', error);
      setError(`Failed to get recommendations: ${error.message}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Voice Input ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice recognition not supported in this browser. Please use Chrome.");
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err) => setError(`Voice input error: ${err.error}`);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        sendSmartMessage(transcript);
      }
    };

    recognition.start();
  };

  // --- Cart Management ---
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.ProductID === product.ProductID);
      if (existingItem) {
        return prev.map(item =>
          item.ProductID === product.ProductID ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.ProductID !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev => prev.map(item =>
        item.ProductID === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalCartItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- UI Helpers ---
  const getCategoryIcon = (category) => {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('watch')) return <Watch className="w-4 h-4" />;
    if (catLower.includes('shoe')) return <Zap className="w-4 h-4" />;
    return <Shirt className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const catLower = category?.toLowerCase() || '';
    if (catLower.includes('watch')) return 'bg-blue-100 text-blue-800';
    if (catLower.includes('shoe')) return 'bg-purple-100 text-purple-800';
    return 'bg-green-100 text-green-800';
  };

  const quickMessages = [
    "Show me casual t-shirts", "I need formal shoes", "Recommend watches under $150", "Find popular jeans"
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendSmartMessage();
    }
  };

  // --- Render Components ---

  const RecommendationCard = ({ product, onAddToCart, inChat = false }) => (
    <div key={product.ProductID} className={`bg-white p-3 rounded-lg border border-gray-200 ${!inChat && 'hover:shadow-md transition-shadow'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{product.ProductName}</h4>
          <p className="text-xs text-gray-600 mt-1">{product.category}</p>
          <div className="flex items-center mt-2 space-x-2">
            <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getCategoryColor(product.category)}`}>
              {getCategoryIcon(product.category)}
              <span>ID: {product.ProductID}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{(product.Rating || 0).toFixed(1)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="ml-2 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          title="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Fashion Assistant</h1>
              <p className="text-sm text-gray-600">Your AI-powered style advisor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">User ID:</label>
            <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user ID" className="w-28 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500" />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mb-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800 text-sm flex-1">{error}</p>
              <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {/* Tabs */}
        <nav className="flex space-x-1 px-4">
          {['chat', 'recommendations', 'cart'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
              <div className="flex items-center">
                {tab === 'chat' && <MessageCircle className="w-4 h-4 mr-2" />}
                {tab === 'recommendations' && <TrendingUp className="w-4 h-4 mr-2" />}
                {tab === 'cart' && <ShoppingCart className="w-4 h-4 mr-2" />}
                <span className="capitalize">{tab}</span>
                {tab === 'cart' && <span className="ml-2 bg-gray-200 text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">{getTotalCartItems()}</span>}
              </div>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'bot' && <Bot className="w-6 h-6 text-gray-500 mb-4 flex-shrink-0" />}
                  <div className={`max-w-2xl px-4 py-3 rounded-2xl ${msg.type === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'}`}>
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                    {msg.reason && <div className="mt-2 text-xs text-gray-500">Reason: <span className="font-semibold">{msg.reason}</span></div>}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.recommendations.slice(0, 4).map((prod) => (
                          <RecommendationCard key={prod.ProductID} product={prod} onAddToCart={addToCart} inChat={true} />
                        ))}
                      </div>
                    )}
                  </div>
                   {msg.type === 'user' && <User className="w-6 h-6 text-gray-500 mb-4 flex-shrink-0" />}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <Bot className="w-6 h-6 text-gray-500 mb-4 flex-shrink-0" />
                    <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm rounded-bl-none">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                    {quickMessages.map((msg) => (
                        <button key={msg} onClick={() => sendSmartMessage(msg)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                        {msg}
                        </button>
                    ))}
                </div>
              <div className="flex space-x-3">
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask for fashion advice..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" disabled={isLoading} />
                <button onClick={startListening} disabled={isLoading} className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={isListening ? 'Stop listening' : 'Start voice input'}>
                  <Mic className="w-5 h-5" />
                </button>
                <button onClick={() => sendSmartMessage()} disabled={isLoading || !inputMessage.trim()} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'recommendations' && (
          <div className="p-4 h-full overflow-y-auto">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Style Recommendations</h2>
                <button onClick={() => getDirectRecommendations()} disabled={isLoading} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Refresh</span>
                </button>
             </div>
             {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {recommendations.map((prod) => <RecommendationCard key={prod.ProductID} product={prod} onAddToCart={addToCart} />)}
                </div>
             ) : (
                <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No recommendations to show right now.</p>
                    <p className="text-sm text-gray-500">Try chatting with the assistant or clicking "Refresh".</p>
                </div>
             )}
          </div>
        )}
        {activeTab === 'cart' && (
           <div className="p-4 h-full overflow-y-auto">
             <h2 className="text-xl font-semibold text-gray-900 mb-4">Shopping Cart</h2>
             {cartItems.length > 0 ? (
                <div className="space-y-3">
                    {cartItems.map(item => (
                        <div key={item.ProductID} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">{item.ProductName}</h3>
                                <p className="text-sm text-gray-600">{item.category}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <div className="flex items-center space-x-2">
                                    <button onClick={() => updateCartQuantity(item.ProductID, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">-</button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button onClick={() => updateCartQuantity(item.ProductID, item.quantity + 1)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">+</button>
                               </div>
                               <button onClick={() => removeFromCart(item.ProductID)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty.</p>
                </div>
             )}
           </div>
        )}
      </main>
    </div>
  );
};

export default FashionRecommendationSystem;


// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Bot, User, ShoppingCart, Star, Package, TrendingUp, MessageCircle, X, Plus, Trash2, AlertCircle } from 'lucide-react';
// import { Mic, Shirt, Watch, Zap } from 'lucide-react';

// const FashionRecommendationSystem = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       content: "Hello! I'm your personal fashion assistant. I can help you find the perfect clothing, watches, and shoes based on your style preferences, current selections, or shopping history. What can I help you find today?",
//       timestamp: new Date()
//     }
//   ]);

//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [userId, setUserId] = useState('');
//   const [cartItems, setCartItems] = useState([]);
//   const [activeTab, setActiveTab] = useState('chat');
//   const [recommendations, setRecommendations] = useState([]);
//   const [error, setError] = useState('');
//   const [systemStats, setSystemStats] = useState(null);
//   const recognitionRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     loadSystemStats();
//   }, []);

//   const API_BASE = 'http://127.0.0.1:8000';

//   const loadSystemStats = async () => {
//     try {
//       const response = await fetch(`${API_BASE}/stats`);
//       const data = await response.json();
//       setSystemStats(data);
//     } catch (error) {
//       console.error('Error loading system stats:', error);
//     }
//   };

// //   async function getSmartRecommendation(message) {
// //     const response = await fetch("http://127.0.0.1:8000/smart-recommend", {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json"
// //         },
// //         body: JSON.stringify({
// //             message: message,
// //             user_id: 1, // Optional
// //             cart_product_ids: [], // Optional
// //             preferences: {} // Optional
// //         })
// //     });

// //     if (!response.ok) {
// //         console.error("API error:", await response.text());
// //         return;
// //     }

// //     const data = await response.json();
// //     showBotMessage(data.message); // Display chatbot reply
// //     showProductList(data.recommendations); // Display recommendations
// // }
// //   const sendSmartMessage = async () => {
// //   // Replace with valid product ID for testing
// //   const productId = 1;

// //   const userMessage = {
// //     id: messages.length + 1,
// //     type: 'user',
// //     content: inputMessage,
// //     timestamp: new Date()
// //   };

// //   setMessages(prev => [...prev, userMessage]);
// //   setInputMessage('');
// //   setIsLoading(true);
// //   setError('');

// //   try {
// //     const response = await fetch(`${API_BASE}/smart-recommend`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({message: product_id: productId, top_n: 5 }) // Use appropriate ID
// //     });

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     console.log('Recommendations:', data);
// //     const botMessage = {
// //       id: messages.length + 2,
// //       type: 'bot',
// //       content: "Here are your recommendations!",
// //       timestamp: new Date(),
// //       recommendations: { product_details: data }
// //     };

// //     setMessages(prev => [...prev, botMessage]);
// //     setRecommendations(data);
// //   } catch (error) {
// //     console.error('Error sending message:', error);
// //     setError('Failed to connect to recommendation service.');
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// const sendSmartMessage = async () => {
//   const userMessage = {
//     id: messages.length + 1,
//     type: 'user',
//     content: inputMessage,
//     timestamp: new Date()
//   };

//   setMessages(prev => [...prev, userMessage]);
//   setInputMessage('');
//   setIsLoading(true);
//   setError('');


//   try {
//     const response = await fetch(`${API_BASE}/smart-recommend`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: inputMessage,      // 👈 user message
//         user_id: 1,                 // optional
//         cart_product_ids: [1, 2],   // optional, replace with real cart items
//         preferences: {
//           quantity: 5               // optional preferences
//           // budget: 1500           // add if needed
//         },
//         context: "user chatting via assistant"

//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Recommendations:', data);

//     const botMessage = {
//       id: messages.length + 2,
//       type: 'bot',
//       content: data.message || "Here are your recommendations!",
//       timestamp: new Date(),
//       recommendations: { product_details: data.recommendations },
//       algorithmUsed: data.reason
//     };

//     setMessages(prev => [...prev, botMessage]);
//     setRecommendations(data.recommendations);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     setError('Failed to connect to recommendation service.');
//   } finally {
//     setIsLoading(false);
//   }
// };


//   // const sendSmartMessage = async () => {
//   //   if (!inputMessage.trim()) return;

//   //   const userMessage = {
//   //     id: messages.length + 1,
//   //     type: 'user',
//   //     content: inputMessage,
//   //     timestamp: new Date()
//   //   };

//   //   setMessages(prev => [...prev, userMessage]);
//   //   setInputMessage('');
//   //   setIsLoading(true);
//   //   setError('');

//   //   try {
//   //     const response = await fetch(`${API_BASE}/smart-chat`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         message: inputMessage,
//   //         user_id: userId ? parseInt(userId) : null,
//   //         cart_product_ids: cartItems.map(item => item.id),
//   //         preferences: {}
//   //       })
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }

//   //     const data = await response.json();

//   //     const botMessage = {
//   //       id: messages.length + 2,
//   //       type: 'bot',
//   //       content: data.reply,
//   //       timestamp: new Date(),
//   //       recommendations: data.recommendations || null,
//   //       intents: data.detected_intents || [],
//   //       preferences: data.extracted_preferences || {}
//   //     };

//   //     setMessages(prev => [...prev, botMessage]);

//   //     if (data.recommendations) {
//   //       setRecommendations(data.recommendations.product_details || []);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error sending message:', error);
//   //     setError('Failed to connect to the fashion recommendation service. Please check if the backend is running.');
//   //     const errorMessage = {
//   //       id: messages.length + 2,
//   //       type: 'bot',
//   //       content: 'Sorry, I encountered an error connecting to the service. Please try again.',
//   //       timestamp: new Date()
//   //     };
//   //     setMessages(prev => [...prev, errorMessage]);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const startListening = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert("Voice recognition not supported in this browser.");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInputMessage(transcript);
//     };

//     recognition.onerror = (err) => {
//       console.error("Speech recognition error:", err);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

// const getDirectRecommendations = async () => {
//   setIsLoading(true);
//   setError('');

//   try {
//     const response = await fetch(`${API_BASE}/smart-recommend`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: "show popular items",   // 👈 mandatory field
//         preferences: {
//           quantity: 8
//         }
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     setRecommendations(data.recommendations);

//     const botMessage = {
//       id: messages.length + 1,
//       type: 'bot',
//       content: data.message || "Here are the most popular items!",
//       timestamp: new Date(),
//       recommendations: { product_details: data.recommendations },
//       algorithmUsed: data.reason || "Popularity-based"
//     };

//     setMessages(prev => [...prev, botMessage]);
//     setActiveTab('chat');
//   } catch (error) {
//     console.error('Error getting recommendations:', error);
//     setError('Failed to get recommendations.');
//   } finally {
//     setIsLoading(false);
//   }
// };



// //   const getDirectRecommendations = async () => {
// //   setIsLoading(true);
// //   setError('');

// //   try {
// //     const response = await fetch(`${API_BASE}/smart-recommend`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({ top_n: 8 })
// //     });

// //     if (!response.ok) {
// //       throw new Error(`HTTP error! status: ${response.status}`);
// //     }

// //     const data = await response.json();

// //     setRecommendations(data);

// //     const botMessage = {
// //       id: messages.length + 1,
// //       type: 'bot',
// //       content: "Here are the most popular items!",
// //       timestamp: new Date(),
// //       recommendations: { product_details: data },
// //       algorithmUsed: "Popularity-based"
// //     };

// //     setMessages(prev => [...prev, botMessage]);
// //     setActiveTab('chat');
// //   } catch (error) {
// //     console.error('Error getting recommendations:', error);
// //     setError('Failed to get recommendations.');
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };


//   // const getDirectRecommendations = async () => {
//   //   setIsLoading(true);
//   //   setError('');

//   //   try {
//   //     const response = await fetch(`${API_BASE}/personalized-recommendations`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         message: "Get me personalized fashion recommendations",
//   //         user_id: userId ? parseInt(userId) : null,
//   //         cart_product_ids: cartItems.map(item => item.id),
//   //         preferences: { quantity: 8 }
//   //       })
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }

//   //     const data = await response.json();
//   //     setRecommendations(data.recommendations.product_details || []);

//   //     const botMessage = {
//   //       id: messages.length + 1,
//   //       type: 'bot',
//   //       content: data.explanation,
//   //       timestamp: new Date(),
//   //       recommendations: data.recommendations,
//   //       algorithmUsed: data.algorithm_used
//   //     };

//   //     setMessages(prev => [...prev, botMessage]);
//   //     setActiveTab('chat');
//   //   } catch (error) {
//   //     console.error('Error getting recommendations:', error);
//   //     setError('Failed to get recommendations. Please check if the backend is running.');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const addToCart = (product) => {
//     if (!cartItems.find(item => item.id === product.id)) {
//       setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
//     }
//   };

//   const removeFromCart = (productId) => {
//     setCartItems(prev => prev.filter(item => item.id !== productId));
//   };

//   const updateCartQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCartItems(prev => prev.map(item =>
//       item.id === productId ? { ...item, quantity } : item
//     ));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendSmartMessage();
//     }
//   };

//   const quickMessages = [
//     "Show me casual t-shirts",
//     "I need formal shoes",
//     "Recommend watches under $200",
//     "Find jeans in my size",
//     "Show trending fashion items",
//     "Suggest a complete outfit"
//   ];

//   const getTotalCartItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getCategoryIcon = (category) => {
//     const categoryLower = category?.toLowerCase() || '';
//     if (categoryLower.includes('watch')) return <Watch className="w-4 h-4" />;
//     if (categoryLower.includes('shoe') || categoryLower.includes('footwear')) return <Zap className="w-4 h-4" />;
//     return <Shirt className="w-4 h-4" />;
//   };

//   const getCategoryColor = (category) => {
//     const categoryLower = category?.toLowerCase() || '';
//     if (categoryLower.includes('watch')) return 'bg-blue-100 text-blue-800';
//     if (categoryLower.includes('shoe') || categoryLower.includes('footwear')) return 'bg-purple-100 text-purple-800';
//     return 'bg-gray-100 text-gray-800';
//   };

//   return (
//     <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 p-0 ">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
//               <Shirt className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold text-gray-900">Fashion Assistant</h1>
//               <p className="text-sm text-gray-600">Your personal style advisor</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             {/* <div className="flex items-center space-x-2">
//               <label className="text-sm font-medium text-gray-700">User ID:</label>
//               <input
//                 type="number"
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 placeholder="Enter user ID"
//                 className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               />
//             </div> */}
//             <div className="flex items-center space-x-2 text-gray-600">
//               <ShoppingCart className="w-5 h-5" />
//               <span className="text-sm font-medium">{getTotalCartItems()}</span>
//             </div>
//           </div>
//         </div>

//         {/* Error Banner */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mb-4">
//             <div className="flex items-center">
//               <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
//               <p className="text-red-700 text-sm">{error}</p>
//               <button
//                 onClick={() => setError('')}
//                 className="ml-auto text-red-400 hover:text-red-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="flex space-x-1 px-4 pb-4">
//           <button
//             onClick={() => setActiveTab('chat')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'chat'
//                 ? 'bg-gray-900 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//           >
//             <MessageCircle className="w-4 h-4 inline mr-2" />
//             Chat
//           </button>
//           <button
//             onClick={() => setActiveTab('recommendations')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'recommendations'
//                 ? 'bg-gray-900 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//           >
//             <TrendingUp className="w-4 h-4 inline mr-2" />
//             Recommendations
//           </button>
//           <button
//             onClick={() => setActiveTab('cart')}
//             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'cart'
//                 ? 'bg-gray-900 text-white'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//           >
//             <ShoppingCart className="w-4 h-4 inline mr-2" />
//             Cart ({getTotalCartItems()})
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-hidden">
//         {activeTab === 'chat' && (
//           <div className="flex flex-col h-full">
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-2xl px-4 py-3 rounded-lg ${message.type === 'user'
//                         ? 'bg-gray-900 text-white'
//                         : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
//                       }`}
//                   >
//                     <div className="flex items-start space-x-2">
//                       {message.type === 'bot' && (
//                         <Bot className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
//                       )}
//                       {message.type === 'user' && (
//                         <User className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
//                       )}
//                       <div className="flex-1">
//                         <div className="whitespace-pre-wrap text-sm">
//                           {message.content}
//                         </div>

//                         {/* Show detected intents */}
//                         {message.intents && message.intents.length > 0 && (
//                           <div className="mt-2 flex flex-wrap gap-1">
//                             {message.intents.map((intent, index) => (
//                               <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
//                                 {intent}
//                               </span>
//                             ))}
//                           </div>
//                         )}

//                         {/* Show algorithm used */}
//                         {message.algorithmUsed && (
//                           <div className="mt-2">
//                             <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
//                               Algorithm: {message.algorithmUsed}
//                             </span>
//                           </div>
//                         )}

//                         {/* Recommendation Cards */}
//                         {message.recommendations && message.recommendations.product_details && (
//                           <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
//                             {message.recommendations.product_details.slice(0, 4).map((product,index) => (
//                               <div key={product.id || `prod-${index}`} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//                                 <div className="flex justify-between items-start">
//                                   <div className="flex-1">
//                                     <h4 className="font-medium text-gray-900">{product.name}</h4>
//                                     <p className="text-xs text-gray-600 mt-1">{product.category}</p>
//                                     <div className="flex items-center mt-2 space-x-2">
//                                       <div className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
//                                         {getCategoryIcon(product.category)}
//                                         <span>ID: {product.id}</span>
//                                       </div>
//                                       {product.available && (
//                                         <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                                           Available
//                                         </div>
//                                       )}
//                                     </div>
//                                   </div>
//                                   <button
//                                     onClick={() => addToCart(product)}
//                                     className="ml-2 p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
//                                     title="Add to cart"
//                                   >
//                                     <ShoppingCart className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-xs opacity-70 mt-2">
//                       {message.timestamp.toLocaleTimeString()}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {isLoading && (
//                 <div className="flex justify-start">
//                   <div className="bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 shadow-sm max-w-xs">
//                     <div className="flex items-center space-x-2">
//                       <Bot className="w-5 h-5 text-gray-600" />
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Quick Messages */}
//             <div className="px-4 py-2 bg-white border-t border-gray-200">
//               <div className="flex flex-wrap gap-2">
//                 {quickMessages.map((msg, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setInputMessage(msg)}
//                     className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                   >
//                     {msg}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Input */}
//             <div className="bg-white border-t border-gray-200 p-4">
//               <div className="flex space-x-3">
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Ask about clothing, watches, or shoes..."
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//                   disabled={isLoading}
//                 />
//                 <button
//                   onClick={startListening}
//                   disabled={isLoading}
//                   className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
//                   title="Voice input"
//                 >
//                   <Mic className="w-5 h-5" />
//                 </button>
//                 <button
//                   onClick={sendSmartMessage}
//                   disabled={isLoading || !inputMessage.trim()}
//                   className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//                 >
//                   <Send className="w-4 h-4" />
//                   <span>Send</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'recommendations' && (
//           <div className="p-4 h-full overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Style Recommendations</h2>
//               <button
//                 onClick={getDirectRecommendations}
//                 disabled={isLoading}
//                 className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center space-x-2"
//               >
//                 <TrendingUp className="w-4 h-4" />
//                 <span>Get Recommendations</span>
//               </button>
//             </div>

//             {systemStats && (
//               <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
//                 <h3 className="font-semibold text-gray-900 mb-2">System Stats</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                   <div>
//                     <p className="text-gray-600">Total Users</p>
//                     <p className="font-semibold text-gray-900">{systemStats.total_users}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Fashion Items</p>
//                     <p className="font-semibold text-gray-900">{systemStats.total_products}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Current User</p>
//                     <p className="font-semibold text-gray-900">{userId || 'Guest'}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Cart Items</p>
//                     <p className="font-semibold text-gray-900">{getTotalCartItems()}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {recommendations.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {recommendations.map((product,index) => (
//                   <div key={product.id || `rec-${index}`} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium text-gray-900">{product.name}</h3>
//                       <div className="flex items-center space-x-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                         <span className="text-sm text-gray-600">4.5</span>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-600 mb-3">{product.category}</p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getCategoryColor(product.category)}`}>
//                           {getCategoryIcon(product.category)}
//                           <span>ID: {product.id}</span>
//                         </span>
//                         {product.available && (
//                           <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                             Available
//                           </span>
//                         )}
//                       </div>
//                       <button
//                         onClick={() => addToCart(product)}
//                         className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-1"
//                       >
//                         <Plus className="w-4 h-4" />
//                         <span>Add</span>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600">No recommendations yet. Click "Get Recommendations" to discover your perfect style!</p>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'cart' && (
//           <div className="p-4 h-full overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
//               <div className="text-sm text-gray-600">
//                 {getTotalCartItems()} item{getTotalCartItems() !== 1 ? 's' : ''}
//               </div>
//             </div>

//             {cartItems.length > 0 ? (
//               <div className="space-y-4">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900">{item.name}</h3>
//                         <p className="text-sm text-gray-600">{item.category}</p>
//                         <div className="flex items-center mt-2 space-x-2">
//                           <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getCategoryColor(item.category)}`}>
//                             {getCategoryIcon(item.category)}
//                             <span>ID: {item.id}</span>
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
//                             className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
//                           >
//                             -
//                           </button>
//                           <span className="w-8 text-center font-medium">{item.quantity}</span>
//                           <button
//                             onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
//                             className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Your cart items will be used to suggest complementary fashion pieces and similar styles.
//                   </p>
//                   <button
//                     onClick={getDirectRecommendations}
//                     disabled={isLoading}
//                     className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
//                   >
//                     Get Style Recommendations
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600">Your cart is empty. Start adding some fashion items!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FashionRecommendationSystem;

// // import React, { useState, useRef, useEffect } from 'react';
// // import { Send, Mic, MicOff, ShoppingCart, Sparkles } from 'lucide-react';

// // const WalmartRecommendationApp = () => {
// //   const [messages, setMessages] = useState([
// //     {
// //       id: 1,
// //       text: "Hello! I'm your Walmart recommendation assistant. I can help you find products using different recommendation methods. Try asking me about product recommendations!",
// //       sender: 'ai',
// //       timestamp: new Date()
// //     }
// //   ]);
// //   const [inputText, setInputText] = useState('');
// //   const [isListening, setIsListening] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const recognitionRef = useRef(null);
// //   const messagesEndRef = useRef(null);

// //   // Initialize speech recognition
// //   useEffect(() => {
// //     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
// //       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //       recognitionRef.current = new SpeechRecognition();
// //       recognitionRef.current.continuous = false;
// //       recognitionRef.current.interimResults = false;
// //       recognitionRef.current.lang = 'en-US';

// //       recognitionRef.current.onresult = (event) => {
// //         const transcript = event.results[0][0].transcript;
// //         setInputText(transcript);
// //         setIsListening(false);
// //       };

// //       recognitionRef.current.onerror = () => {
// //         setIsListening(false);
// //       };

// //       recognitionRef.current.onend = () => {
// //         setIsListening(false);
// //       };
// //     }
// //   }, []);

// //   // Auto scroll to bottom
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [messages]);

// //   // API call to backend
// //   const callRecommendationAPI = async (endpoint, data) => {
// //     try {
// //       const response = await fetch(`http://localhost:8000${endpoint}`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(data),
// //       });
      
// //       if (!response.ok) {
// //         throw new Error(`API call failed: ${response.status}`);
// //       }
      
// //       return await response.json();
// //     } catch (error) {
// //       console.error('API Error:', error);
// //       throw error;
// //     }
// //   };

// //   // Process user input and determine recommendation type
// //   const processUserInput = async (text) => {
// //     const lowerText = text.toLowerCase();
    
// //     // Extract product ID if mentioned
// //     const productIdMatch = text.match(/\d+/);
// //     const productId = productIdMatch ? parseInt(productIdMatch[0]) : null;
    
// //     try {
// //       let recommendations = [];
// //       let recommendationType = '';
      
// //       if (lowerText.includes('content') || lowerText.includes('similar')) {
// //         if (!productId) {
// //           return "Please provide a product ID for content-based recommendations. For example: 'Show me similar products to product 123'";
// //         }
// //         recommendations = await callRecommendationAPI('/recommend/content', { product_id: productId });
// //         recommendationType = 'Content-Based';
// //       } else if (lowerText.includes('popular') || lowerText.includes('trending')) {
// //         recommendations = await callRecommendationAPI('/recommend/popular', { top_n: 5 });
// //         recommendationType = 'Popular';
// //       } else if (lowerText.includes('rule') || lowerText.includes('category')) {
// //         if (!productId) {
// //           return "Please provide a product ID for rule-based recommendations. For example: 'Show me products in the same category as product 456'";
// //         }
// //         recommendations = await callRecommendationAPI('/recommend/rule', { product_id: productId });
// //         recommendationType = 'Rule-Based';
// //       } else if (lowerText.includes('cluster') || lowerText.includes('group')) {
// //         if (!productId) {
// //           return "Please provide a product ID for cluster-based recommendations. For example: 'Show me products from the same cluster as product 789'";
// //         }
// //         recommendations = await callRecommendationAPI('/recommend/cluster', { product_id: productId });
// //         recommendationType = 'Cluster-Based';
// //       } else {
// //         return "I can help you with different types of recommendations:\n• Content-based: 'Show me similar products to product 123'\n• Popular: 'Show me popular products'\n• Rule-based: 'Show me products in the same category as product 456'\n• Cluster-based: 'Show me products from the same cluster as product 789'";
// //       }

// //       if (recommendations.length === 0) {
// //         return `No ${recommendationType.toLowerCase()} recommendations found. Please try a different product ID or recommendation type.`;
// //       }

// //       return formatRecommendations(recommendations, recommendationType);
// //     } catch (error) {
// //       return "Sorry, I encountered an error while fetching recommendations. Please make sure the backend server is running on http://localhost:8000";
// //     }
// //   };

// //   // Format recommendations for display
// //   const formatRecommendations = (recommendations, type) => {
// //     let response = `Here are your ${type} recommendations:\n\n`;
    
// //     recommendations.forEach((product, index) => {
// //       response += `${index + 1}. ${product.ProductName}\n`;
// //       response += `   ID: ${product.ProductID}\n`;
// //       response += `   Category: ${product.category}\n`;
      
// //       if (product.Rating) response += `   Rating: ${product.Rating}\n`;
// //       if (product.price) response += `   Price: $${product.price}\n`;
// //       if (product.gender) response += `   Gender: ${product.gender}\n`;
// //       if (product.cluster !== undefined) response += `   Cluster: ${product.cluster}\n`;
      
// //       response += '\n';
// //     });
    
// //     return response;
// //   };

// //   // Handle voice input
// //   const toggleVoiceInput = () => {
// //     if (!recognitionRef.current) {
// //       alert('Speech recognition is not supported in your browser');
// //       return;
// //     }

// //     if (isListening) {
// //       recognitionRef.current.stop();
// //       setIsListening(false);
// //     } else {
// //       recognitionRef.current.start();
// //       setIsListening(true);
// //     }
// //   };

// //   // Handle sending messages
// //   const handleSendMessage = async () => {
// //     if (!inputText.trim()) return;

// //     const userMessage = {
// //       id: Date.now(),
// //       text: inputText,
// //       sender: 'user',
// //       timestamp: new Date()
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInputText('');
// //     setIsLoading(true);

// //     try {
// //       const response = await processUserInput(inputText);
      
// //       const aiMessage = {
// //         id: Date.now() + 1,
// //         text: response,
// //         sender: 'ai',
// //         timestamp: new Date()
// //       };

// //       setMessages(prev => [...prev, aiMessage]);
// //     } catch (error) {
// //       const errorMessage = {
// //         id: Date.now() + 1,
// //         text: "Sorry, I encountered an error. Please try again.",
// //         sender: 'ai',
// //         timestamp: new Date()
// //       };
// //       setMessages(prev => [...prev, errorMessage]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Handle Enter key
// //   const handleKeyPress = (e) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 p-0 ">


// //       {/* Chat Interface */}
// //       <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg">
// //         {/* Chat Header */}
// //         <div className="p-4 border-b border-gray-200 bg-black text-white">
// //           <h2 className="text-lg font-semibold">AI Assistant</h2>
// //           <p className="text-sm text-gray-300">Ask me for product recommendations</p>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //           {messages.map((message) => (
// //             <div
// //               key={message.id}
// //               className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
// //             >
// //               <div
// //                 className={`max-w-xs px-4 py-2 rounded-lg ${
// //                   message.sender === 'user'
// //                     ? 'bg-black text-white'
// //                     : 'bg-gray-100 text-black'
// //                 }`}
// //               >
// //                 <p className="text-sm whitespace-pre-wrap">{message.text}</p>
// //                 <p className="text-xs mt-1 opacity-70">
// //                   {message.timestamp.toLocaleTimeString([], {
// //                     hour: '2-digit',
// //                     minute: '2-digit'
// //                   })}
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
          
// //           {isLoading && (
// //             <div className="flex justify-start">
// //               <div className="bg-gray-100 text-black px-4 py-2 rounded-lg">
// //                 <div className="flex items-center space-x-2">
// //                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
// //                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
// //                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
          
// //           <div ref={messagesEndRef} />
// //         </div>

// //         {/* Input Area */}
// //         <div className="p-4 border-t border-gray-200">
// //           <div className="flex items-center space-x-2">
// //             <div className="flex-1 relative">
// //               <textarea
// //                 value={inputText}
// //                 onChange={(e) => setInputText(e.target.value)}
// //                 onKeyPress={handleKeyPress}
// //                 placeholder="Ask for product recommendations..."
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
// //                 rows="2"
// //               />
// //             </div>
            
// //             <button
// //               onClick={toggleVoiceInput}
// //               className={`p-2 rounded-lg transition-colors ${
// //                 isListening
// //                   ? 'bg-red-500 text-white hover:bg-red-600'
// //                   : 'bg-gray-100 text-black hover:bg-gray-200'
// //               }`}
// //               title={isListening ? 'Stop listening' : 'Start voice input'}
// //             >
// //               {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
// //             </button>
            
// //             <button
// //               onClick={handleSendMessage}
// //               disabled={!inputText.trim() || isLoading}
// //               className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// //               title="Send message"
// //             >
// //               <Send className="w-5 h-5" />
// //             </button>
// //           </div>
          
// //           {isListening && (
// //             <p className="text-sm text-red-500 mt-2 flex items-center">
// //               <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
// //               Listening...
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default WalmartRecommendationApp;
