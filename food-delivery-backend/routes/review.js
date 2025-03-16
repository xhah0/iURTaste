const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const RestaurantReview = require('../models/RestaurantReview');
const MenuItemReview = require('../models/MenuItemReview');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/Menu');

const router = express.Router();

// Add Review for Restaurant
router.post('/restaurant/:restaurantId', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const review = new RestaurantReview({
            user: req.user.userId,
            restaurant: restaurant._id,
            rating,
            comment,
        });

        await review.save();

        // Update Restaurant's Average Rating
        const reviews = await RestaurantReview.find({ restaurant: restaurant._id });
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        restaurant.avgRating = avgRating;
        await restaurant.save();

        res.status(201).json({ message: 'Review added successfully', review });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add Review for Menu Item
router.post('/menu-item/:menuItemId', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const menuItem = await MenuItem.findById(req.params.menuItemId);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        const review = new MenuItemReview({
            user: req.user.userId,
            menuItem: menuItem._id,
            rating,
            comment,
        });

        await review.save();

        // Update Menu Item's Average Rating
        const reviews = await MenuItemReview.find({ menuItem: menuItem._id });
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        menuItem.avgRating = avgRating;
        await menuItem.save();

        res.status(201).json({ message: 'Review added successfully', review });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Reviews for a Restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const reviews = await RestaurantReview.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get Reviews for a Menu Item
router.get('/menu-item/:menuItemId', async (req, res) => {
    try {
        const reviews = await MenuItemReview.find({ menuItem: req.params.menuItemId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a Review for Restaurant
router.put('/restaurant/:reviewId', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await RestaurantReview.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a Review for Menu Item
router.put('/menu-item/:reviewId', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await MenuItemReview.findById(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this review' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
