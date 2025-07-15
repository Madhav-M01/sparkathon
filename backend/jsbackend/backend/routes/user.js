const express = require('express');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middlewares/auth');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update current user profile
router.put('/me', auth, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['name', 'email', 'phone', 'address', 'paymentMethod'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;