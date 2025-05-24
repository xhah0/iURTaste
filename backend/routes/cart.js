const express = require('express');
const { protect } = require('../middleware/auth');

const {
    addToCart,
    getCart,
    removeFromCart,
    syncCart, clearCart, clearCartRoute
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.post('/remove', protect, removeFromCart);
router.post('/sync', protect, syncCart);
router.post('/clear', protect, clearCartRoute);

module.exports = router;
