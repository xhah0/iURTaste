module.exports = (io) => {
    const express = require('express');
    const authMiddleware = require('../middleware/authMiddleware');
    const Order = require('../models/Order');
    const Driver = require('../models/Driver');

    const router = express.Router();

    // Assign a Driver to an Order (Admin/Restaurant only)
    router.put('/assign/:orderId', authMiddleware, async (req, res) => {
        try {
            if (req.user.role !== 'admin' && req.user.role !== 'restaurant') {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const { driverId } = req.body;
            const order = await Order.findById(req.params.orderId);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            const driver = await Driver.findById(driverId);
            if (!driver || !driver.availability) return res.status(400).json({ message: 'Driver not available' });

            order.driver = driverId;
            order.status = 'Out for Delivery';
            await order.save();

            driver.availability = false;
            await driver.save();

            // Notify users about driver assignment
            io.to(order._id.toString()).emit('orderStatusUpdated', 'Out for Delivery');

            res.status(200).json({ message: 'Driver assigned successfully', order });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });

    // Update Order Delivery Status (Driver Only)
    router.put('/update-status/:orderId', authMiddleware, async (req, res) => {
        try {
            const { status } = req.body;
            const order = await Order.findById(req.params.orderId);

            if (!order) return res.status(404).json({ message: 'Order not found' });

            if (order.driver.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }

            order.status = status;
            await order.save();

            // If delivered, free up the driver
            if (status === 'Delivered') {
                const driver = await Driver.findById(order.driver);
                driver.availability = true;
                await driver.save();
            }

            // Notify users about the order status update
            io.to(order._id.toString()).emit('orderStatusUpdated', status);

            res.status(200).json({ message: 'Order status updated', order });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });

    // Update Driver's Real-Time Location
    router.put('/update-location/:driverId', authMiddleware, async (req, res) => {
        try {
            const { latitude, longitude } = req.body;
            const driver = await Driver.findById(req.params.driverId);

            if (!driver) return res.status(404).json({ message: 'Driver not found' });

            // Emit driver's live location to clients
            io.emit('driverLocationUpdate', { driverId: driver._id, latitude, longitude });

            res.status(200).json({ message: 'Location updated' });

        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    });

    return router;
};
