const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the restaurant owner
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    cuisine: { type: String, required: true }, // E.g., "Italian", "Mexican"
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }], // Reference to menu items
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
