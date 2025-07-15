const express = require('express');
const Review = require('../models/Review');
const router = express.Router();
const auth = require('../middlewares/auth'); // <-- fixed

// Add a review
router.post('/:productId', auth, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const review = new Review({
      productId: req.params.productId,
      userId: req.user.id,
      rating,
      comment
    });
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;