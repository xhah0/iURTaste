const express = require('express');
const { protect } = require('../middleware/auth');

const {
    addToCart,
    getCart,
    removeFromCart,
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.post('/remove', protect, removeFromCart);

module.exports = router;
