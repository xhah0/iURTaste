const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');
const deliveryRoutes = require('./routes/delivery');
const stripe = require('stripe')('sk_test_51RBl7yIyxMSX00ECyiFyPzVID1rqwSbl8q76Xw0CrRsoxJOw24hKJKIBVXY1XqV8CYQyGXYaCOs9x1PAGiPsTmkC00DQUrLqDs'); // Replace with your actual secret key
const paymentRoutes = require('./routes/payment');
const admin = require('firebase-admin');
const serviceAccount = require('./iurtaste-firebase-admin.json');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', require('./routes/cart'));

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
