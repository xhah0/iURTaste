const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    vehicleType: { type: String, enum: ['Bike', 'Car', 'Scooter'], required: true },
    availability: { type: Boolean, default: true }, // Driver is available for delivery
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
