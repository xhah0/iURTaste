const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/Menu');

const router = express.Router();

// Add Menu Item (Only Restaurant Owners)
router.post('/:restaurantId/menu', authMiddleware, roleMiddleware(['restaurant']), async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        if (restaurant.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized to add menu items to this restaurant" });
        }

        const newMenuItem = new MenuItem({
            restaurant: req.params.restaurantId,
            name,
            description,
            price,
            imageUrl,
            category
        });

        await newMenuItem.save();
        restaurant.menu.push(newMenuItem._id);
        await restaurant.save();

        res.status(201).json({ message: "Menu item added successfully", menuItem: newMenuItem });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get Menu Items for a Restaurant
router.get('/:restaurantId/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
