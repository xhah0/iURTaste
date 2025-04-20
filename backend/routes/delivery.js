const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { assignDeliveryPerson, updateDeliveryStatus } = require('../controllers/deliveryController');

const router = express.Router();

// Assign delivery person to an order (Admin or Restaurant)
router.put('/assign-delivery', protect, assignDeliveryPerson);

// Update delivery status (Delivery personnel only)
router.put('/update-status', protect, updateDeliveryStatus);

module.exports = router;
