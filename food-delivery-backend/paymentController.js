const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body; // Amount in cents

    try {
        // Create a PaymentIntent with the amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount should be in cents, so $20 will be 2000
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle payment confirmation
const confirmPayment = async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        // Confirm the payment
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update order status to 'Paid' and perform necessary actions
            res.status(200).json({ message: 'Payment successful', paymentIntent });
        } else {
            res.status(400).json({ message: 'Payment failed', paymentIntent });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPaymentIntent,
    confirmPayment
};
