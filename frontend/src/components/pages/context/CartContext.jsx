import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: token },
      });
      setCart(res.data.cart || []);
    } catch (err) {
      setCart([]);
    }
    setLoading(false);
  };

  const addToCart = async (item) => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/cart/add", item, {
      headers: { Authorization: token },
    });
    fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/cart/update`,
      { productId, quantity },
      { headers: { Authorization: token } }
    );
    fetchCart();
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
      headers: { Authorization: token },
    });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};