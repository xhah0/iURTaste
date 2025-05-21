const express = require('express');
const { protect } = require('../middleware/auth');
const { createOrder, getOrdersForCustomer, updateOrderStatus, getUserOrders} = require('../controllers/orderController');
const { checkout } = require('../controllers/orderController');
const { getRestaurantOrders } = require('../controllers/orderController');
const { getDeliveryOrders } = require('../controllers/orderController');
const { updateDeliveryStatus } = require('../controllers/orderController');

const router = express.Router();

// Customer Order Routes
router.post('/', protect, createOrder); // Place an order
router.get('/', protect, getOrdersForCustomer); // Get customer orders

// Admin / Restaurant Order Routes
router.put('/update-status', protect, updateOrderStatus); // Update order status


router.post('/checkout', protect, checkout);
router.get('/my-orders', protect, getUserOrders);
router.get('/restaurant-orders', protect, getRestaurantOrders);
router.get('/delivery-orders', protect, getDeliveryOrders);
router.put('/:orderId/delivery-status', protect, updateDeliveryStatus);

module.exports = router;
