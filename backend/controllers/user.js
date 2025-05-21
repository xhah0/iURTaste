const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.changePassword = async (req, res) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: user not logged in' });
    }

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Missing password fields' });
    }
    console.log('[REQ.USER]', req.user);

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
