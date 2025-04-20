const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    createMenuItem,
    getMenuItemsForRestaurant,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

const router = express.Router();

// Routes for restaurant-specific menu items
router.post('/:restaurantId', protect, createMenuItem);
router.get('/:restaurantId', protect, getMenuItemsForRestaurant);
router.put('/:restaurantId/menu/:menuItemId', protect, updateMenuItem);
router.delete('/:restaurantId/menu/:menuItemId', protect, deleteMenuItem);

module.exports = router;
