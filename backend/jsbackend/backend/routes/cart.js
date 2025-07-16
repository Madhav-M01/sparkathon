const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');
const router = express.Router();

// Add to cart
router.post('/add', auth, async (req, res) => {
  const { productId, name, price, size, image } = req.body;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    // Check if item already in cart
    const itemIndex = cart.items.findIndex(item => item.productId === productId && item.size === size);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, name, price, size, image });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    res.json({ cart: cart ? cart.items : [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

module.exports = router;
