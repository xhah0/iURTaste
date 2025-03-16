const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const MenuItem = require('../models/Menu');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Get all menu items for a specific restaurant
router.get('/menus/:restaurantId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Add a menu item to a restaurant
router.post('/menus/:restaurantId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const newMenuItem = new MenuItem({
            restaurant: restaurant._id,
            name,
            description,
            price,
            imageUrl,
        });

        await newMenuItem.save();
        res.status(201).json({ message: 'Menu item added successfully', newMenuItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update an existing menu item
router.put('/menus/:restaurantId/:menuItemId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        const menuItem = await MenuItem.findById(req.params.menuItemId);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.imageUrl = imageUrl || menuItem.imageUrl;

        await menuItem.save();
        res.status(200).json({ message: 'Menu item updated successfully', menuItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a menu item
router.delete('/menus/:restaurantId/:menuItemId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.menuItemId);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        await menuItem.remove();
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
