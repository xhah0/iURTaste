const admin = require('firebase-admin');

const sendPushNotification = async (deviceToken, title, message) => {
    try {
        const notification = {
            notification: {
                title: title,
                body: message,
            },
            token: deviceToken,
        };

        const response = await admin.messaging().send(notification);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendPushNotification };
