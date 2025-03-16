// routes/protectedRoute.js
const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Protected route
router.get('/profile', authenticate, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user });
});

module.exports = router;
