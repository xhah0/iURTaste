const express = require('express');
const { protect } = require('../middleware/auth');
const {
    createRestaurant,
    getAllRestaurants
} = require('../controllers/restaurantController');

const router = express.Router();

router.post('/', protect, createRestaurant);
router.get('/', getAllRestaurants);

module.exports = router;
