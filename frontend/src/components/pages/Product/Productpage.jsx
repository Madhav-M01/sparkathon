import React, { useState, useEffect } from 'react';
import {
  Heart, ChevronLeft, ChevronDown, Star, Menu, Search,
  ShoppingBag, Truck, Package, Calendar, Shield, ArrowRight, Send
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { products } from '../../../utils/newdata';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  
  // Find product from data if ID is provided, otherwise use fallback
  const product = id ? products.find(p => String(p.id) === String(id)) : null;
  
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');
  // Product-specific comments with different comments for each product
  const getProductComments = (productId) => {
    const commentData = {
      '1': [
        
      ],
      '2': [
        
      ],
      '3': [
        
      ],
      '4': [
        
      ],
      '5': [
        
      ]
    };
    return commentData[productId] || [];
  };

const currentProduct = product || fallbackProduct;

const [comments, setComments] = useState(() => getProductComments(currentProduct.id));
const [newComment, setNewComment] = useState('');

  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState('');
  
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Reset states when product changes
  useEffect(() => {
    setSelectedSize('S');
    setSelectedImage(0);
    setExpandedSection('description');
    setComments(getProductComments(currentProduct.id));
  }, [id, currentProduct.id]);

  // Fallback data if product not found or no ID provided
  const fallbackProduct = {
    id: '1',
    title: 'Loose Fit Hoodie',
    category: 'Men Fashion',
    price: 2499,
    discounted_price: 2499,
    discount: 0,
    rating: 4.5,
    description: 'Loose-fit sweatshirt hoodie in medium-weight cotton-blend fabric with a generous, lightly oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.',
    images: [
      '/api/placeholder/400/500',
      '/api/placeholder/400/500',
      '/api/placeholder/400/500',
      '/api/placeholder/400/500'
    ]
  };

 // const currentProduct = product || fallbackProduct;

  const sizes = ['S', 'M', 'L', 'XXL'];
  const relatedProducts = [
    { 
      id: 2, 
      name: 'Polo with Contrast Trims', 
      price: 212, 
      originalPrice: 339, 
      rating: 4.0, 
      image: 'https://res.cloudinary.com/dwaa5xndg/image/upload/v1752263910/products/shirt2.jpg'
    },
    { 
      id: 3, 
      name: 'Gradient Graphic T-shirt', 
      price: 145, 
      rating: 3.5, 
      image: 'https://res.cloudinary.com/dwaa5xndg/image/upload/v1752263915/products/shirt3.jpg'
    },
    { 
      id: 4, 
      name: 'Polo with Tipping Details', 
      price: 180, 
      rating: 4.5, 
      image: 'https://res.cloudinary.com/dwaa5xndg/image/upload/v1752263916/products/shirt4.jpg'
    },
    { 
      id: 5, 
      name: 'Striped Jacket', 
      price: 120, 
      originalPrice: 160, 
      rating: 5.0, 
      image: 'https://res.cloudinary.com/dwaa5xndg/image/upload/v1752263918/products/shirt5.jpg'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 
          i < rating ? 'fill-yellow-400/50 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderInteractiveStars = (rating, onRatingChange) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        onClick={() => onRatingChange(i + 1)}
      />
    ));
  };

  const handleAddToCart = async () => {
    await addToCart({
      productId: currentProduct.id,
      name: currentProduct.title,
      price: currentProduct.discounted_price / 100, // Convert to dollars if needed
      size: selectedSize,
      image: currentProduct.images[selectedImage]
    });
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && userName.trim()) {
      const comment = {
        id: Date.now(), // Use timestamp to ensure unique IDs
        name: userName,
        date: new Date().toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        rating: newRating,
        comment: newComment,
        avatar: "/api/placeholder/40/40"
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setUserName('');
      setNewRating(5);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
           
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-lg">Nextgen</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                />
              </div>
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-black">About</a>
                <a href="#" className="text-gray-600 hover:text-black">FAQs</a>
                <div className="relative cursor-pointer" onClick={() => navigate('/123456')}>
                  <ShoppingBag className="w-6 h-6 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">{cartCount}</span>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-black">Home</span>
          <ArrowRight className="w-4 h-4" />
          <span className="text-black">Product details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
              <img
                src={currentProduct.images[selectedImage]}
                alt={currentProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">{currentProduct.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentProduct.title}</h1>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-bold">₹{currentProduct.discounted_price}</span>
                {currentProduct.discount > 0 && (
                  <>
                    <span className="text-gray-400 line-through text-sm">₹{currentProduct.price}</span>
                    <span className="text-red-500 text-sm">-{currentProduct.discount}%</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {renderStars(currentProduct.rating)}
                <span className="text-sm text-gray-600 ml-2">{currentProduct.rating}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Order in 03:30:36 to get next day delivery</span>
            </div>

            {/* Size Selection */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Select Size</p>
              <div className="flex space-x-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-full border text-sm font-medium ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button onClick={handleAddToCart} className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Add to Cart
              </button>
             
            </div>

            {/* Description & Shipping */}
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'description' ? '' : 'description')}
                  className="flex items-center justify-between w-full py-3 text-left"
                >
                  <span className="font-medium">Description & Fit</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'description' ? 'rotate-180' : ''}`} />
                </button>
                {expandedSection === 'description' && (
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{currentProduct.description}</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setExpandedSection(expandedSection === 'shipping' ? '' : 'shipping')}
                  className="flex items-center justify-between w-full py-3 text-left"
                >
                  <span className="font-medium">Shipping</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {expandedSection === 'shipping' && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium">Express</p>
                          <p className="text-xs text-gray-600">Dec 50%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium">Regular Package</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium">Delivery Time</p>
                          <p className="text-xs text-gray-600">3-4 Working Days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium">Estimated Arrival</p>
                          <p className="text-xs text-gray-600">10 - 12 October 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Rating & Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">4,5</div>
                <div className="text-gray-600 mb-4">/ 5</div>
                <div className="text-sm text-gray-600 mb-6">({comments.length} Reviews)</div>
                
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{rating}</span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: rating === 5 ? '80%' : rating === 4 ? '15%' : '5%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {/* Comment Form */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Write a Review</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex space-x-1">
                      {renderInteractiveStars(newRating, setNewRating)}
                      <span className="ml-2 text-sm text-gray-600">({newRating}/5)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post Review</span>
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews ({comments.length})</h4>
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                            <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{comment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-3">
                            {renderStars(comment.rating)}
                            <span className="text-sm text-gray-600 ml-2">({comment.rating}/5)</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                            "{comment.comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-12">You might also like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleRelatedProductClick(product.id)}
              >
                <div className="aspect-square bg-gray-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                        <span className="text-red-500 text-sm">-30%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-semibold text-lg">Nextgen</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We have clothes that suits your style and which you're proud to wear. From women to men.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">@</span>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">COMPANY</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Features</a></li>
                <li><a href="#" className="hover:text-black">Works</a></li>
                <li><a href="#" className="hover:text-black">Career</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">HELP</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Customer Support</a></li>
                <li><a href="#" className="hover:text-black">Delivery Details</a></li>
                <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">FAQ</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Account</a></li>
                <li><a href="#" className="hover:text-black">Manage Deliveries</a></li>
                <li><a href="#" className="hover:text-black">Orders</a></li>
                <li><a href="#" className="hover:text-black">Payments</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">RESOURCES</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black">Free eBooks</a></li>
                <li><a href="#" className="hover:text-black">Development Tutorial</a></li>
                <li><a href="#" className="hover:text-black">How to - Blog</a></li>
                <li><a href="#" className="hover:text-black">Youtube Playlist</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">Nextgen © 2000-24, All Rights Reserved</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <img src="/api/placeholder/40/24" alt="Visa" className="h-6" />
              <img src="/api/placeholder/40/24" alt="Mastercard" className="h-6" />
              <img src="/api/placeholder/40/24" alt="PayPal" className="h-6" />
              <img src="/api/placeholder/40/24" alt="Apple Pay" className="h-6" />
              <img src="/api/placeholder/40/24" alt="Google Pay" className="h-6" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
