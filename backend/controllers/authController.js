const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already in use' });

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user);

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.user._id;
    const { name, email, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
        }

        if (name) user.name = name;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password required' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Rehash new password manually
            const salt = await require('bcryptjs').genSalt(10);
            user.password = await require('bcryptjs').hash(newPassword, salt);
        }

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Profile update failed' });
    }
};

exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: Math.random().toString(36).slice(-8), // random fallback
                profilePicture: picture,
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Google login failed' });
    }
};

exports.getLoyaltyPoints = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            loyaltyPoints: user.loyaltyPoints,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch loyalty points' });
    }
};
