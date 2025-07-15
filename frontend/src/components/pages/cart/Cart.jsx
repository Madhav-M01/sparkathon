import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) return <div>Loading...</div>;

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center border-b py-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">Size: {item.size}</div>
                <div className="text-sm">₹ {item.price}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item.productId, (item.quantity || 1) - 1)} className="px-2 py-1 border rounded">-</button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item.productId, (item.quantity || 1) + 1)} className="px-2 py-1 border rounded">+</button>
              </div>
              <button onClick={() => removeFromCart(item.productId)} className="ml-4 text-red-500">Remove</button>
            </div>
          ))}
          <div className="text-right mt-6">
            <span className="font-bold text-lg">Total: ₹ {total}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;