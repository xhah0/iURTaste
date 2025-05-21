const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { protect } = require('../middleware/auth');

// Protected route
router.post('/change-password', protect, userController.changePassword);

module.exports = router; // ✅ exports the router itself
