const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Get all restaurants (Admin only)
router.get('/restaurants', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add a new restaurant
router.post('/restaurants', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, location, description, imageUrl } = req.body;

        const newRestaurant = new Restaurant({
            name,
            location,
            description,
            imageUrl,
        });

        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant added successfully', newRestaurant });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update an existing restaurant
router.put('/restaurants/:restaurantId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, location, description, imageUrl } = req.body;
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        restaurant.name = name || restaurant.name;
        restaurant.location = location || restaurant.location;
        restaurant.description = description || restaurant.description;
        restaurant.imageUrl = imageUrl || restaurant.imageUrl;

        await restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a restaurant
router.delete('/restaurants/:restaurantId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        await restaurant.remove();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
