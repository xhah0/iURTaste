const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

exports.addToCart = async (req, res) => {
    const { menuItemId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.menuItem.toString() === menuItemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ menuItem: menuItemId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};
//
// exports.addToCart = async (req, res) => {
//     const { menuItemId, quantity } = req.body;
//
//     try {
//         let cart = await Cart.findOne({ user: req.user._id });
//
//         if (!cart) {
//             cart = new Cart({ user: req.user._id, items: [] });
//         }
//
//         const existingItem = cart.items.find(item => item.menuItem.toString() === menuItemId);
//
//         if (existingItem) {
//             existingItem.quantity += quantity;
//         } else {
//             cart.items.push({ menuItem: menuItemId, quantity });
//         }
//
//         await cart.save();
//
//         // Repopulate menuItem and nested restaurant
//         const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
//             path: 'items.menuItem',
//             populate: { path: 'restaurant', select: '_id name' }
//         });
//
//         res.status(200).json(populatedCart);
//     } catch (err) {
//         console.error('Add to cart error:', err);
//         res.status(500).json({ message: 'Failed to add to cart' });
//     }
// };


exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
        res.status(200).json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    const { menuItemId } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove item' });
    }
};

exports.clearCart = async (userId) => {
    try {
        await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    } catch (err) {
        console.error('Failed to clear cart:', err);
    }
};

exports.syncCart = async (req, res) => {
    const { items } = req.body; // items = [{ menuItemId, quantity }, ...]
    if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items format' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        } else {
            cart.items = []; // clear current cart
        }

        for (const item of items) {
            if (item.menuItemId && item.quantity > 0) {
                cart.items.push({
                    menuItem: item.menuItemId,
                    quantity: item.quantity,
                });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        console.error('Cart sync error:', err);
        res.status(500).json({ message: 'Failed to sync cart' });
    }
};
