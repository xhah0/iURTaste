const stripe = require('stripe')('sk_test_51RBl7yIyxMSX00ECyiFyPzVID1rqwSbl8q76Xw0CrRsoxJOw24hKJKIBVXY1XqV8CYQyGXYaCOs9x1PAGiPsTmkC00DQUrLqDs'); // Your secret key from Stripe

exports.createPaymentIntent = async (req, res) => {
    const { orderId, amount } = req.body; // Order amount to be paid

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects the amount in cents
            currency: 'usd', // or any currency you prefer
            metadata: { orderId: orderId }
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret, // This will be sent to the client-side for payment processing
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create payment intent' });
    }
};
