const Notification = require('../models/Notification');

// Function to create a notification
const createNotification = async (userId, message, type) => {
    try {
        const notification = new Notification({
            user: userId,
            message,
            type,
            status: 'unread',
        });

        await notification.save();
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = { createNotification };
