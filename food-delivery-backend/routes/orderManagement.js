const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const Order = require('../models/Order');

const router = express.Router();

// Get all orders for the admin
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find().populate('user restaurant items.menuItem');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update order status
router.put('/orders/:orderId/status', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
