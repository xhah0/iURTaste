const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res) => {
    const { name, description, logo, location } = req.body;

    try {
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ message: 'Only restaurant owners can create restaurants' });
        }

        const newRestaurant = new Restaurant({
            name,
            description,
            logo,
            location,
            owner: req.user._id
        });

        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create restaurant' });
    }
};

exports.getAllRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find().populate('owner', 'name email');
    res.status(200).json(restaurants);
};
