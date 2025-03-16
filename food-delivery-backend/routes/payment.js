const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Add your Stripe Secret Key

const router = express.Router();

// Make a Payment (Create a Payment Intent and Confirm)
router.post('/:orderId', authMiddleware, async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Create Payment Intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: order.totalAmount * 100, // Amount is in cents, so multiply by 100
            currency: 'usd',
            payment_method: paymentMethod,
            confirmation_method: 'manual',
            confirm: true,
        });

        // Handle confirmation of payment
        if (paymentIntent.status === 'succeeded') {
            const payment = new Payment({
                order: order._id,
                user: req.user.userId,
                amount: order.totalAmount,
                paymentMethod: 'Stripe', // Simulating Stripe method
                status: 'Success', // Payment was successful
            });

            // Update Order Status to Paid
            order.paymentStatus = 'Paid';
            await order.save();
            await payment.save();

            res.status(201).json({
                message: 'Payment successful',
                payment,
                paymentIntent,
            });
        } else {
            res.status(400).json({ message: 'Payment failed', paymentIntent });
        }
    } catch (error) {
        if (error.type === 'StripeCardError') {
            // Card declined error handling
            res.status(400).json({ message: 'Card declined', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
});

// Get Payment Status
router.get('/:orderId', authMiddleware, async (req, res) => {
    try {
        const payment = await Payment.findOne({ order: req.params.orderId });
        if (!payment) return res.status(404).json({ message: "Payment not found" });

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
