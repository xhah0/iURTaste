const express = require('express');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

router.post('/', protect, async (req, res) => {
    const { items, totalAmount } = req.body;

    try {
        const order = new Order({
            customer: req.user._id,
            items: items.map(item => ({
                menuItem: item._id || item.id, // adapt to your actual IDs
                quantity: item.quantity
            })),
            totalAmount,
            status: 'pending'
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save order' });
    }
});

module.exports = router;
