const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Required for WebSockets
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); // WebSocket CORS settings

// Enable CORS for all routes
app.use(cors()); // This will allow requests from all origins

// OR enable CORS with custom configuration (to allow only specific origins)
const corsOptions = {
    origin: 'http://192.168.0.144:8082', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

// Other middlewares and routes
app.use(express.json()); // For parsing application/json
app.use('/api/auth', require('./routes/auth')); // Your authentication routes

// Start MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the Food Delivery API');
});

// WebSocket connection (optional, if you use it)
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
