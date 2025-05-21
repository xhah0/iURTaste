const express = require('express');
const { protect } = require('../middleware/auth');
const { createPaymentIntent } = require('../controllers/paymentController');

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
