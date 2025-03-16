const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, // Associated restaurant
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: false }, // Optional image
    category: { type: String, required: true }, // E.g., "Appetizer", "Main Course"
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
