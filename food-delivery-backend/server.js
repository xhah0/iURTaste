const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for WebSockets
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server, { cors: { origin: "*" } }); // Enable WebSockets

const restaurantRoutes = require('./routes/restaurant');
const menuRoutes = require('./routes/menu');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order')(io); // Pass io to routes
const paymentRoutes = require('./routes/payment');
const deliveryRoutes = require('./routes/delivery')(io); // Pass io to routes


const nodemailer = require('nodemailer');

// Create a transporter object using Gmail (use your actual email and password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password (or App password)
    },
});

// Send an Email Helper Function
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


const adminRoutes = require('./routes/admin'); // Import Admin Routes

// Other routes...
app.use('/api/admin', adminRoutes); // Admin route prefix


// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinOrderRoom', (orderId) => {
        socket.join(orderId);
        console.log(`User joined order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the Food Delivery API');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
