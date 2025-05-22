const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { sendPushNotification } = require('../utils/notification'); // Import the notification helper
const Cart = require('../models/Cart');
const { clearCart } = require('./cartController');

// exports.createOrder = async (req, res) => {
//     const { restaurantId, items, deliveryAddress } = req.body;
//     const customerId = req.user._id;
//
//     try {
//         const restaurant = await Restaurant.findById(restaurantId);
//
//         if (!restaurant) {
//             return res.status(404).json({ message: 'Restaurant not found' });
//         }
//
//         if (!['cod', 'card'].includes(paymentMethod)) {
//             return res.status(400).json({ message: 'Invalid payment method' });
//         }
//
//         // Calculate total price
//         let totalAmount = 0;
//         const orderItems = [];
//         for (let item of items) {
//             const menuItem = await MenuItem.findById(item.menuItemId);
//             if (!menuItem) {
//                 return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });
//             }
//
//             const totalPrice = menuItem.price * item.quantity;
//             totalAmount += totalPrice;
//             orderItems.push({
//                 menuItem: menuItem._id,
//                 quantity: item.quantity,
//                 totalPrice
//             });
//         }
//
//         const newOrder = new Order({
//             customer: customerId,
//             restaurant: restaurantId,
//             items: orderItems,
//             deliveryAddress,
//             totalAmount
//         });
//
//         await newOrder.save();
//         res.status(201).json(newOrder);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to create order' });
//     }
// };

exports.createOrder = async (req, res) => {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;
    const customerId = req.user._id;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        if (!['cod', 'card'].includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem) return res.status(404).json({ message: `Menu item ${item.menuItemId} not found` });

            totalAmount += menuItem.price * item.quantity;
            orderItems.push({ menuItem: menuItem._id, quantity: item.quantity });
        }

        const newOrder = new Order({
            customer: customerId,
            restaurant: restaurantId,
            items: orderItems,
            deliveryAddress,
            paymentMethod,
            totalAmount,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

exports.getOrdersForCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).populate('restaurant', 'name').populate('items.menuItem');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get orders' });
    }
};

// exports.updateOrderStatus = async (req, res) => {
//     const { orderId, status } = req.body;
//
//     try {
//         const order = await Order.findById(orderId);
//
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//
//         if (order.restaurant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//             return res.status(403).json({ message: 'Not authorized to update this order' });
//         }
//
//         order.status = status;
//         await order.save();
//         res.status(200).json(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to update order status' });
//     }
// };

// Add this inside the updateOrderStatus function

exports.updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId).populate('customer restaurant deliveryPerson');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.restaurant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        if (status === 'completed') {
            const pointsToAdd = Math.floor(order.totalAmount); // 1 point per $1
            const user = await User.findById(order.customer._id);

            user.loyaltyPoints += pointsToAdd;
            await user.save();
        }


        order.status = status;
        await order.save();

        // Notify the customer, restaurant, and delivery person
        const customerDeviceToken = order.customer.deviceToken; // Assuming deviceToken is saved for customers
        const restaurantDeviceToken = order.restaurant.deviceToken; // Assuming restaurant has deviceToken
        const deliveryPersonDeviceToken = order.deliveryPerson ? order.deliveryPerson.deviceToken : null;

        // Send notifications
        if (customerDeviceToken) {
            sendPushNotification(customerDeviceToken, 'Order Status Update', `Your order status is now ${status}`);
        }
        if (restaurantDeviceToken) {
            sendPushNotification(restaurantDeviceToken, 'Order Status Update', `Order #${order._id} is now ${status}`);
        }
        if (deliveryPersonDeviceToken) {
            sendPushNotification(deliveryPersonDeviceToken, 'Delivery Assignment', `You are now assigned to deliver order #${order._id}`);
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};


exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const orderItems = cart.items.map(item => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
        }));

        const totalAmount = cart.items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

        // Assuming all items are from same restaurant (you can enhance later)
        const restaurant = cart.items[0].menuItem.restaurant;

        const newOrder = new Order({
            customer: req.user._id,
            items: orderItems,
            totalAmount,
            restaurant,
        });

        await newOrder.save();

        await clearCart(req.user._id); // Clear cart after order placed

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Checkout failed' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
};

exports.getRestaurantOrders = async (req, res) => {
    try {
        // Make sure only restaurant users can access this
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const orders = await Order.find({ restaurant: req.user.restaurant })
            .populate('customer', 'name email')
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve restaurant orders' });
    }
};

exports.getDeliveryOrders = async (req, res) => {
    try {
        if (req.user.role !== 'delivery') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const orders = await Order.find({ deliveryPerson: req.user._id })
            .populate('customer', 'name email')
            .populate('restaurant', 'name location')
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch delivery orders' });
    }

};
exports.updateDeliveryStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role !== 'delivery' || order.deliveryPerson?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this order' });
        }

        const allowedStatuses = ['delivering', 'completed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status update by delivery' });
        }

        order.status = status;

        if (status === 'completed') {
            // Give loyalty points to the customer
            const customer = await User.findById(order.customer);
            if (customer && customer.role === 'user') {
                // Example: 1 point per $10 spent
                const totalAmount = order.totalAmount || 0;
                const pointsToAdd = Math.floor(totalAmount / 10);

                customer.loyaltyPoints += pointsToAdd;
                await customer.save();
            }
        }

        await order.save();


        res.status(200).json({ message: 'Order status updated by delivery', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update delivery status' });
    }
};



