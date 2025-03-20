const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

// Protected Route: Get User Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

const roleMiddleware = require('../middleware/roleMiddleware');

// Admin-Only Route: Get All Users
router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



// Register (Sign Up)
router.post('/signup', async (req, res) => {
    try {
        const { name, surname, phone, email, username, password, role } = req.body;

        // Ensure only Admins can create other roles
        if (role && role !== 'customer' && req.user?.role !== 'admin') {
            return res.status(403).json({ message: "Only admins can assign roles" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            surname,
            phone,
            email,
            username,
            password: hashedPassword,
            role: role || 'customer' // Default role: customer
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, username: user.username } });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



router.post("/register", async (req, res) => {
    try {
        const { username, email, password, birthday, deviceToken } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            birthday,
        });

        await newUser.save();

        res.status(201).json({ message: "Signup successful", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
