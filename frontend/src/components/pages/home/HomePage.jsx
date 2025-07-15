import React, { useState } from 'react';
import { Search, Menu, Heart, ShoppingBag, User, Star, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../../utils/newdata';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeProductFilter, setActiveProductFilter] = useState('ALL');
  const [activeMainFilter, setActiveMainFilter] = useState('ALL');
  
  const popularProducts = [
    { id: 1, name: 'Premium Hoodie', price: '$89', image: '/api/placeholder/300/400', liked: true },
    { id: 2, name: 'Designer Sunglasses', price: '$159', image: '/api/placeholder/300/400', liked: false },
    { id: 3, name: 'Classic Boots', price: '$199', image: '/api/placeholder/300/400', liked: true }
  ];

  const recommendations = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);

  // Enhanced customer reviews with messages and ratings
  const customerReviews = [
    {
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c108?w=150&h=150&fit=crop&crop=face",
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality and fast delivery! Highly recommend this store.",
      date: "2 days ago"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      name: "Mike Chen",
      rating: 5,
      comment: "Perfect fit and great customer service. Will shop again!",
      date: "5 days ago"
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      name: "Emma Davis",
      rating: 4,
      comment: "Love the style and quality. Quick shipping too!",
      date: "1 week ago"
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      name: "Alex Rodriguez",
      rating: 5,
      comment: "Outstanding products and excellent packaging. Very satisfied!",
      date: "1 week ago"
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'ALL') return true;
    return product.subcategory === activeCategory;
  });

  // Popular Products Filtered Array
  const filteredPopularProducts = filteredProducts.filter(product => {
    if (activeProductFilter === 'ALL') return true;
    return (
      product.subcategory?.toLowerCase() === activeProductFilter.toLowerCase() ||
      product.title?.toLowerCase().includes(activeProductFilter.toLowerCase())
    );
  });

  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold flex items-center">
                <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">N</span>
                Next Z
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-black">About</a>
              <a href="#" className="text-gray-700 hover:text-black">FAQs</a>
              <User className="w-5 h-5 text-gray-700 cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </nav>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <select
                className="border border-gray-300 rounded px-3 py-2 bg-white"
                value={activeCategory}
                onChange={e => {
                  setActiveCategory(e.target.value);
                  if (e.target.value !== 'ALL') {
                    navigate(`/category/${encodeURIComponent(e.target.value)}`);
                  }
                }}
              >
                <option value="ALL">All Categories</option>
                <option value="T-Shirts">T-Shirt</option>
                <option value="Shirts">Shirt</option>
                <option value="Pants">Pants</option>
                <option value="Watches">Watches</option>
                <option value="Shoes">Shoes</option>
              </select>

              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                <button type="submit">
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </button>
              </form>
            </div>

            <nav className="flex space-x-8">
              <button
                className={`text-gray-700 hover:text-black`}
                onClick={() => navigate('/category/men')}
              >
                Men
              </button>
              <button
                className={`text-gray-700 hover:text-black`}
                onClick={() => navigate('/category/women')}
              >
                Women
              </button>
            
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section and first div */}
            <div
              className="relative rounded-2xl overflow-hidden h-80 bg-cover bg-center"
              style={{ backgroundImage: "url('/src/assets/homepage_image/2.jpg')" }}
            >
              {/* Optional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-70"></div>

              {/* Optional black overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>

              <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
                <div>
                  <h1 className="text-5xl font-bold mb-4">Summer Arrival of Outfit</h1>
                  <p className="text-lg mb-6">Discover quality fashion that reflects your style and makes everyday enjoyable.</p>
                  <button
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold flex items-center mx-auto space-x-2 hover:bg-gray-100 transition-colors"
                    onClick={() => navigate("/12345")}
                  >
                    <span>EXPLORE PRODUCT</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Promotional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Where dreams meet couture</h3>
                  <button className="bg-white px-6 py-2 rounded-full text-sm font-semibold mt-4 hover:bg-gray-100 transition-colors"
                    onClick={()=>{navigate("/12345")}}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Enchanting styles for every women</h3>
                  <button className="bg-white px-6 py-2 rounded-full text-sm font-semibold mt-4 hover:bg-gray-100 transition-colors"
                    onClick={()=>{navigate("/12345")}}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

          
            {/* Popular Products */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Popular products</h2>
              <div className="flex space-x-4 mb-6">
                {['ALL', 'JACKETS', 'SHOES', 'T-SHIRT'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveProductFilter(filter)}
                    className={`px-6 py-2 rounded-full transition-colors ${
                      activeProductFilter === filter ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredPopularProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden mb-4">
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <h3 className="font-semibold mb-1">{product.title}</h3>
                    <p className="text-gray-600">₹{product.discounted_price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Exclusive Offers */}
            <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl p-6 text-center">
              <div className="mb-4">
                <span className="bg-white px-3 py-1 rounded-full text-sm">OFFERS</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">EXCLUSIVE FASHION OFFERS AWAIT FOR YOUR</h3>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center mx-auto space-x-2"
               onClick={()=>{navigate("/12345")}}
              >
                <span>CHECK IT NOW</span>
                <Play className="w-4 h-4" />
              </button>
            </div>

            {/* Enhanced Customer Reviews with messages and ratings */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Over 350+ Customer reviews from our service</h3>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {customerReviews.map((review, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">{review.name}</h4>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarRating rating={review.rating} />
                        <span className="text-sm font-medium ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              {/* Summary stats */}
              <div className="flex items-center justify-center gap-4 py-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">4.8</div>
                  <div className="text-xs text-gray-600">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">350+</div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfied</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-2xl font-bold mb-4">You might also like</h3>
              <div className="space-y-4">
                {recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 group cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="relative w-20 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      <div className="flex items-center space-x-1 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{item.rating}</span>
                      </div>
                      <p className="font-semibold text-sm">₹{item.discounted_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">STAY UP TO DATE ABOUT OUR LATEST OFFERS</h3>
              <div className="space-y-3">
                <button className="w-full bg-white rounded-full py-3 px-4 text-left text-gray-500 flex items-center">
                  <span>Enter your email here</span>
                </button>
                <button className="w-full bg-black text-white rounded-full py-3 px-4 font-semibold">
                  Subscribe to Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">COMPANY</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Features</a></li>
                <li><a href="#" className="hover:text-black">Works</a></li>
                <li><a href="#" className="hover:text-black">Career</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">HELP</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Customer Support</a></li>
                <li><a href="#" className="hover:text-black">Delivery Details</a></li>
                <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">FAQ</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Account</a></li>
                <li><a href="#" className="hover:text-black">Manage Deliveries</a></li>
                <li><a href="#" className="hover:text-black">Orders</a></li>
                <li><a href="#" className="hover:text-black">Payments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">RESOURCES</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black">Free eBooks</a></li>
                <li><a href="#" className="hover:text-black">Development Tutorial</a></li>
                <li><a href="#" className="hover:text-black">How to - Blog</a></li>
                <li><a href="#" className="hover:text-black">Youtube Playlist</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 flex justify-between items-center">
            <p className="text-gray-600">© 2024 Nextgen. All rights reserved.</p>
            <div className="flex space-x-4">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">🟡</span>
              <span className="text-2xl">🔵</span>
              <span className="text-2xl">⚫</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;