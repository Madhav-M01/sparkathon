import React, { useState } from 'react';
import {
  Heart,
  ChevronLeft,
  ChevronDown,
  Star,
  Menu,
  Search,
  ShoppingBag,
  Truck,
  Package,
  Calendar,
  Shield,
  ArrowRight  
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../../utils/newdata';

function Productlist() {
  const navigate =useNavigate();
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');
  const [searchText, setSearchText] = useState(''); // <-- NEW

  const productImages = [
    '/api/placeholder/400/500',
    '/api/placeholder/400/500',
    '/api/placeholder/400/500',
    '/api/placeholder/400/500'
  ];

  const sizes = ['S', 'M', 'L', 'XXL'];


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Filtered products based on search
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase())
  );

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
              <span className="font-semibold text-lg">Next Z</span>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or category"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
              </div>
              <nav className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-black">
                  About
                </a>
                <a href="#" className="text-gray-600 hover:text-black">
                  FAQs
                </a>
                <ShoppingBag  onClick={() => navigate('/123456')}
                className="w-6 h-6 text-gray-600" />
              </nav>
            </div>
          </div>

          <div className="flex space-x-8 border-t border-gray-200">
            <span onClick={() => navigate('/category/men')} className="py-4 text-sm font-medium border-b-2 border-black">
              Men
            </span>
            <span onClick={() => navigate('/category/women')} className="py-4 text-sm text-gray-600 hover:text-black">
              Women
            </span>
           
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          <span
          onClick={() => navigate('/')}
          >Home</span>
          <ArrowRight className="w-4 h-4" />
          <span className="text-black">Product details</span>
        </div>
      </div>

      {/* Product List */}
      <div className="mt-8 p-4 m-16 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" >
          {filteredProducts.length === 0 ? (
            <div className="col-span-4 text-center text-gray-500">No products found.</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-square bg-gray-200">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{product.title}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">₹{product.discounted_price}</span>
                    {product.discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{product.price}
                        </span>
                        <span className="text-red-500 text-sm">-{product.discount}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {/* Brand Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="font-semibold text-lg">Nextgen</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  We design clothes that suit your style and make you proud to wear them.
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

              {/* Links */}
              <div>
                <h3 className="font-medium mb-4">COMPANY</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-black">About</a></li>
                  <li><a href="#" className="hover:text-black">Features</a></li>
                  <li><a href="#" className="hover:text-black">Careers</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">HELP</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-black">Support</a></li>
                  <li><a href="#" className="hover:text-black">Delivery Info</a></li>
                  <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">FAQ</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-black">Account</a></li>
                  <li><a href="#" className="hover:text-black">Track Orders</a></li>
                  <li><a href="#" className="hover:text-black">Returns</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-4">RESOURCES</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-black">Blog</a></li>
                  <li><a href="#" className="hover:text-black">Style Guide</a></li>
                  <li><a href="#" className="hover:text-black">Lookbook</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">Nextgen © 2024. All Rights Reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <img src="/api/placeholder/40/24" alt="Visa" className="h-6" />
                <img src="/api/placeholder/40/24" alt="Mastercard" className="h-6" />
                <img src="/api/placeholder/40/24" alt="PayPal" className="h-6" />
                <img src="/api/placeholder/40/24" alt="Apple Pay" className="h-6" />
              </div>
            </div>
          </div>
          </footer>


    </div>
  );
}

export default Productlist;

