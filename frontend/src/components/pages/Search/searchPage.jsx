import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { products } from '../../../utils/newdata.js';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const searchText = query.get('q') || '';
  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category.toLowerCase().includes(searchText.toLowerCase()) ||
    product.subcategory.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{searchText}"</h2>
      {filteredProducts.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
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
                  <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">₹{product.discounted_price}</span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                      <span className="text-red-500 text-sm">-{product.discount}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;