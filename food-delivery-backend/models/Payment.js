const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'Cash on Delivery'], required: true },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
