const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.createMenuItem = async (req, res) => {
    const { name, description, price, image } = req.body;
    const restaurantId = req.params.restaurantId;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add menu items to this restaurant' });
        }

        const newMenuItem = new MenuItem({
            name,
            description,
            price,
            image,
            restaurant: restaurantId
        });

        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create menu item' });
    }
};

exports.getMenuItemsForRestaurant = async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
        const menuItems = await MenuItem.find({ restaurant: restaurantId });
        res.status(200).json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get menu items' });
    }
};

exports.updateMenuItem = async (req, res) => {
    const { name, description, price, image } = req.body;
    const menuItemId = req.params.menuItemId;

    try {
        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        if (menuItem.restaurant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this menu item' });
        }

        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.image = image || menuItem.image;

        await menuItem.save();
        res.status(200).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update menu item' });
    }
};

exports.deleteMenuItem = async (req, res) => {
    const menuItemId = req.params.menuItemId;

    try {
        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // if (menuItem.restaurant.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Not authorized to delete this menu item' });
        // }
        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update/delete this menu item' });
        }


        await menuItem.remove();
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete menu item' });
    }
};
