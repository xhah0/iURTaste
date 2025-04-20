const Order = require('../models/Order');
const User = require('../models/User');

exports.assignDeliveryPerson = async (req, res) => {
    const { orderId, deliveryPersonId } = req.body;

    try {
        // Check if the user exists and is a delivery person
        const deliveryPerson = await User.findById(deliveryPersonId);

        if (!deliveryPerson || deliveryPerson.role !== 'delivery') {
            return res.status(400).json({ message: 'Invalid delivery person' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Order cannot be assigned to delivery at this stage' });
        }

        // Assign the delivery person to the order
        order.deliveryPerson = deliveryPersonId;
        order.status = 'in-progress';  // Update order status to in-progress
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to assign delivery person' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.deliveryPerson.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update delivery status' });
    }
};
