const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null }, // Assigned driver
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
