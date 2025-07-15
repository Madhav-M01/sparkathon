import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Plus, Minus, Trash2, Package, Leaf, CreditCard, Truck, Check, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Order = () => {
  const [currentView, setCurrentView] = useState('cart');
  const navigate=useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Soft Hoodie',
      price: 250000,
      size: 'S',
      quantity: 1,
      image: '/api/placeholder/100/100',
      selected: true
    },
    {
      id: 2,
      name: 'Leather Bag',
      price: 150000,
      size: 'S',
      quantity: 1,
      image: '/api/placeholder/100/100',
      selected: false
    },
    {
      id: 3,
      name: 'Sunglasses',
      price: 399000,
      size: 'S',
      quantity: 1,
      image: '/api/placeholder/100/100',
      selected: false
    }
  ]);
  
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      items: ['Soft Hoodie', 'Sunglasses'],
      total: 649000,
      status: 'delivered',
      date: '2024-06-15',
      trackingId: 'TRK123456789'
    },
    {
      id: 'ORD002',
      items: ['Leather Bag'],
      total: 150000,
      status: 'shipped',
      date: '2024-06-18',
      trackingId: 'TRK987654321'
    }
  ]);
  
  const [promoCode, setPromoCode] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [trackingId, setTrackingId] = useState('');
  const [ecoScore, setEcoScore] = useState(2450); // User's current eco score
  const [showEcoInfo, setShowEcoInfo] = useState(false);
 //// add next 
 // const [currentView, setCurrentView] = useState('cart');
 // const [trackingId, setTrackingId] = useState('');
  const [cartItems2] = useState([
    { id: 1, selected: true, name: 'Product 1' },
    { id: 2, selected: false, name: 'Product 2' },
    { id: 3, selected: true, name: 'Product 3' }
  ]);
  /// add end 
  const getEcoScoreFromDonation = (amount) => {
    return Math.floor(amount / 10); // 1 point per ₹10 donated
  };

  const getDiscountFromEcoScore = (score) => {
    if (score >= 5000) return 15;
    if (score >= 3000) return 10;
    if (score >= 1500) return 5;
    return 0;
  };

  // Fixed: Added the missing getEcoLevel function
  const getEcoLevel = (score) => {
    if (score >= 5000) {
      return { level: 'Eco Champion', icon: '🏆', color: 'text-yellow-600' };
    } else if (score >= 3000) {
      return { level: 'Tree Guardian', icon: '🌳', color: 'text-green-700' };
    } else if (score >= 1500) {
      return { level: 'Sapling Supporter', icon: '🌱', color: 'text-green-600' };
    } else {
      return { level: 'Eco Beginner', icon: '🌿', color: 'text-green-500' };
    }
  };

  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString()}`;
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => 
      item.selected ? sum + (item.price * item.quantity) : sum, 0
    );
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleSelect = (id) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const selectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(items => 
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const CartView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold">Cart</h1>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="checkbox"
              checked={cartItems.every(item => item.selected)}
              onChange={selectAll}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Select All</span>
            <button 
              onClick={() => setCartItems(items => items.filter(item => !item.selected))}
              className="text-red-500 text-sm ml-auto hover:underline"
            >
              Remove Selected
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4"
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600 text-sm">Size: {item.size}</p>
                    <p className="font-semibold mt-2">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-6">Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(getSubtotal())}</span>
            </div>
            
            <div className="border-t pt-4">
              <label className="text-sm text-gray-600 mb-2 block">
                Do you have a promotional code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800">
                  Apply
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200 mb-4">
                {/* Eco Score Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf size={18} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">Plant Trees & Earn Rewards! 🌱</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`font-medium ${getEcoLevel(ecoScore).color}`}>
                          {getEcoLevel(ecoScore).icon} {getEcoLevel(ecoScore).level}
                        </span>
                        <span className="text-green-600">• {ecoScore} Eco Points</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEcoInfo(!showEcoInfo)}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    How it works?
                  </button>
                </div>

                {/* Eco Info Popup */}
                {showEcoInfo && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                      🌍 Environmental Impact & CO₂ Absorption
                    </h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🌱</span>
                        <div>
                          <strong>Sapling (₹50):</strong> Absorbs 22kg CO₂/year when mature. 
                          Equivalent to driving 95km less in a car!
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🌳</span>
                        <div>
                          <strong>Small Tree (₹150):</strong> Mature trees absorb 48kg CO₂/year. 
                          Equal to powering your home for 2 days with clean energy!
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">🏞️</span>
                        <div>
                          <strong>Forest Patch (₹500):</strong> 10+ trees absorbing 220kg+ CO₂/year. 
                          Removes equivalent emissions from 950km of car travel!
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-white rounded border-l-4 border-green-500">
                        <strong>💡 Did you know?</strong> One mature tree produces oxygen for 2 people per day 
                        and can reduce surrounding temperature by 2-8°F through shade and water evaporation!
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Discount Available */}
                {getDiscountFromEcoScore(ecoScore) > 0 && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      <span className="text-sm font-medium text-orange-800">
                        You've unlocked {getDiscountFromEcoScore(ecoScore)}% discount on your next purchase!
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-green-700 mb-3">
                  Join 12,847 eco-warriors who've planted <span className="font-semibold">25,692 trees</span> this month!
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    onClick={() => setDonationAmount(50)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      donationAmount === 50 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-green-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="text-lg">🌱</div>
                    <div className="text-xs font-medium">₹50</div>
                    <div className="text-xs text-gray-600">1 Sapling</div>
                    <div className="text-xs text-blue-600 font-medium">+5 Points</div>
                  </button>
                  
                  <button
                    onClick={() => setDonationAmount(150)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      donationAmount === 150 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-green-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="text-lg">🌳</div>
                    <div className="text-xs font-medium">₹150</div>
                    <div className="text-xs text-gray-600">Small Tree</div>
                    <div className="text-xs text-blue-600 font-medium">+15 Points</div>
                  </button>
                  
                  <button
                    onClick={() => setDonationAmount(500)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      donationAmount === 500 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-green-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="text-lg">🏞️</div>
                    <div className="text-xs font-medium">₹500</div>
                    <div className="text-xs text-gray-600">Forest Patch</div>
                    <div className="text-xs text-blue-600 font-medium">+50 Points</div>
                  </button>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    placeholder="Custom amount"
                    className="flex-1 px-3 py-2 border border-green-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <button 
                    onClick={() => {
                      if (donationAmount > 0) {
                        setEcoScore(prev => prev + getEcoScoreFromDonation(donationAmount));
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    🌍 Donate
                  </button>
                </div>

                {donationAmount > 0 && (
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-800">
                        Your Impact: {Math.floor(donationAmount / 50)} tree{Math.floor(donationAmount / 50) !== 1 ? 's' : ''} planted! 
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="text-green-600">
                        💨 Absorbs ~{(donationAmount / 50 * 22).toFixed(0)}kg CO₂ annually
                      </div>
                      <div className="text-blue-600">
                        ⭐ +{getEcoScoreFromDonation(donationAmount)} Eco Points
                      </div>
                      <div className="text-purple-600">
                        🚗 = {(donationAmount / 50 * 95).toFixed(0)}km less driving
                      </div>
                      <div className="text-orange-600">
                        💡 Powers home for {((donationAmount / 150) * 2).toFixed(1)} days
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Reward Progress */}
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-800">Next Reward Progress</span>
                    <span className="text-xs text-blue-600">
                      {ecoScore >= 5000 ? 'Max Level!' : 
                       ecoScore >= 3000 ? `${5000 - ecoScore} points to Eco Champion` :
                       ecoScore >= 1500 ? `${3000 - ecoScore} points to Tree Guardian` :
                       `${1500 - ecoScore} points to Sapling Supporter`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${ecoScore >= 5000 ? 100 : 
                                ecoScore >= 3000 ? ((ecoScore - 3000) / 2000) * 100 :
                                ecoScore >= 1500 ? ((ecoScore - 1500) / 1500) * 100 :
                                (ecoScore / 1500) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>🌿 Beginner</span>
                    <span>🌱 Supporter</span>
                    <span>🌳 Guardian</span>
                    <span>🏆 Champion</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-green-600">
                  <span>🏆 #1 Eco-Friendly Store</span>
                  <span>🌍 Carbon Neutral Shipping</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(getSubtotal() + donationAmount)}</span>
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('payment')}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('cart')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Payment</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Payment Method</h3>
            <div className="space-y-3">
              {['card', 'paypal', 'bank', 'wallet'].map(method => (
                <label key={method} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <CreditCard size={20} />
                  <span className="capitalize">{method === 'card' ? 'Credit Card' : method}</span>
                </label>
              ))}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Card Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 h-fit">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            {cartItems.filter(item => item.selected).map(item => (
              <div key={item.id} className="flex justify-between">
                <span className="text-sm">{item.name} x{item.quantity}</span>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            {donationAmount > 0 && (
              <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg">
                <div>
                  <span className="text-sm font-medium">🌱 Environment Donation</span>
                  <div className="text-xs">
                    {Math.floor(donationAmount / 50)} tree{Math.floor(donationAmount / 50) !== 1 ? 's' : ''} • 
                    ~{(donationAmount / 50 * 22).toFixed(0)}kg CO₂/year
                  </div>
                </div>
                <span className="text-sm font-medium">{formatPrice(donationAmount)}</span>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(getSubtotal() + donationAmount)}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              const newOrder = {
                id: `ORD${(orders.length + 1).toString().padStart(3, '0')}`,
                items: cartItems.filter(item => item.selected).map(item => item.name),
                total: getSubtotal() + donationAmount,
                status: 'processing',
                date: new Date().toISOString().split('T')[0],
                trackingId: `TRK${Math.random().toString().substr(2, 9)}`
              };
              setOrders([newOrder, ...orders]);
              setCartItems(items => items.filter(item => !item.selected));
              setCurrentView('orders');
            }}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );

  const OrdersView = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: '',
    productId: null
  });

  const handleWriteReview = (order) => {
    setSelectedOrderForReview(order);
    setShowReviewModal(true);
    setReviewData({
      rating: 0,
      comment: '',
      productId: null
    });
  };

  const handleSubmitReview = () => {
    // Here you would typically send the review to your backend
    console.log('Submitting review:', {
      orderId: selectedOrderForReview.id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      productId: reviewData.productId
    });
    
    setShowReviewModal(false);
    setSelectedOrderForReview(null);
    // You could show a success message here
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('cart')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-semibold">My Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Items</p>
                <p className="text-sm">{order.items.join(', ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="font-medium">{formatPrice(order.total)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
                <p className="text-sm font-mono">{order.trackingId}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => setCurrentView('tracking')}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
              >
                Track Order
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Reorder
              </button>
              {order.status === 'delivered' && (
                <button 
                  onClick={() => handleWriteReview(order)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Write a Review</h2>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order #{selectedOrderForReview?.id}
                </label>
                <p className="text-sm text-gray-600">
                  Items: {selectedOrderForReview?.items.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating 
                  rating={reviewData.rating}
                  onRatingChange={(rating) => setReviewData(prev => ({...prev, rating}))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({...prev, comment: e.target.value}))}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewData.rating === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
   const TrackingView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentView('orders')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Track Your Order</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Track
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-medium mb-6">Order Status</h3>
        
        <div className="space-y-6">
          {[
            { step: 'Order Confirmed', status: 'completed', date: '2024-06-18 10:30' },
            { step: 'Processing', status: 'completed', date: '2024-06-18 14:15' },
            { step: 'Shipped', status: 'current', date: '2024-06-19 09:00' },
            { step: 'Out for Delivery', status: 'pending', date: '' },
            { step: 'Delivered', status: 'pending', date: '' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.status === 'completed' ? 'bg-green-100 text-green-600' :
                item.status === 'current' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {item.status === 'completed' ? <Check size={16} /> :
                 item.status === 'current' ? <Truck size={16} /> :
                 <Package size={16} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.step}</p>
                {item.date && <p className="text-sm text-gray-600">{item.date}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-medium">Current Location</span>
          </div>
          <p className="text-sm text-gray-600">
            Your package is currently at the distribution center in Jaipur and will be delivered by tomorrow.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span onClick={()=>navigate("/")}
                className="text-xl font-semibold">Nextgen</span>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setCurrentView('cart')}
                  className={`px-4 py-2 rounded-lg ${currentView === 'cart' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  Cart
                </button>
                <button 
                  onClick={() => setCurrentView('orders')}
                  className={`px-4 py-2 rounded-lg ${currentView === 'orders' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  Orders
                </button>
                <button 
                  onClick={() => setCurrentView('tracking')}
                  className={`px-4 py-2 rounded-lg ${currentView === 'tracking' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  Track
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.filter(item => item.selected).length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'cart' && <CartView />}
        {currentView === 'payment' && <PaymentView />}
        {currentView === 'orders' && <OrdersView />}
        {currentView === 'tracking' && <TrackingView />}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1 p-2">
          <button 
            onClick={() => setCurrentView('cart')}
            className={`p-3 rounded-lg flex flex-col items-center gap-1 ${currentView === 'cart' ? 'bg-gray-100' : ''}`}
          >
            <ShoppingCart size={20} />
            <span className="text-xs">Cart</span>
          </button>
          <button 
            onClick={() => setCurrentView('orders')}
            className={`p-3 rounded-lg flex flex-col items-center gap-1 ${currentView === 'orders' ? 'bg-gray-100' : ''}`}
          >
            <Package size={20} />
            <span className="text-xs">Orders</span>
          </button>
          <button 
            onClick={() => setCurrentView('tracking')}
            className={`p-3 rounded-lg flex flex-col items-center gap-1 ${currentView === 'tracking' ? 'bg-gray-100' : ''}`}
          >
            <Truck size={20} />
            <span className="text-xs">Track</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
