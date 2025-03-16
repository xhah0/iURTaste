const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const MenuItem = require('../models/Menu');
const Restaurant = require('../models/Restaurant');
const { sendEmail } = require('../utils/email'); // Importing the sendEmail helper

const router = express.Router();
const { createNotification } = require('../services/notificationService');

// Place an Order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { restaurantId, items } = req.body;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        let totalAmount = 0;
        const orderItems = await Promise.all(items.map(async (item) => {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);

            totalAmount += menuItem.price * item.quantity;
            return {
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price
            };
        }));

        const order = new Order({
            user: req.user.userId,
            restaurant: restaurant._id,
            items: orderItems,
            totalAmount
        });

        await order.save();

        // Send Notification to Restaurant
        await createNotification(restaurant.owner, `You have a new order from ${req.user.username}`, 'order');

        // Send Notification to User
        await createNotification(req.user.userId, `Your order has been placed successfully`, 'order');

        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
