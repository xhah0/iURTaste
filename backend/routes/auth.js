const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { name, username, email, password, birthday } = req.body;

        if (!name || !username || !email || !password || !birthday) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const newUser = new User({ name, username, email, password, birthday });
        await newUser.save();

        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error(error);  // Log error to console for more details
        res.status(500).json({ message: 'Server error', error });
    }
});

router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({email: username });
        if (!user) {
            return res.status(404).json({ message: "Username does not exist." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        // Successful login, return user data (excluding password)
        const { password: _, ...userData } = user.toObject(); // Remove password field
        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
