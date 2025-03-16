const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
    message: { type: String, required: true }, // The notification message
    type: { type: String, required: true }, // E.g., "order", "payment", etc.
    status: { type: String, enum: ['unread', 'read'], default: 'unread' }, // Whether the notification is read or unread
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
