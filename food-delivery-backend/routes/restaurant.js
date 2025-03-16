const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Create a Restaurant (Only for Restaurant Owners)
router.post('/', authMiddleware, roleMiddleware(['restaurant']), async (req, res) => {
    try {
        const { name, address, phone, cuisine } = req.body;

        const existingRestaurant = await Restaurant.findOne({ name });
        if (existingRestaurant) return res.status(400).json({ message: "Restaurant name already exists" });

        const newRestaurant = new Restaurant({
            owner: req.user.userId, // Owner is the logged-in user
            name,
            address,
            phone,
            cuisine
        });

        await newRestaurant.save();
        res.status(201).json({ message: "Restaurant created successfully", restaurant: newRestaurant });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get All Restaurants (Public)
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email');
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get a Single Restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('menu');
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
