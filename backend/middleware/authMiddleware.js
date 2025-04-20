const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // remove password
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token failed or expired' });
    }
};

module.exports = { protect };




































































































// const jwt = require("jsonwebtoken");
//
// const authMiddleware = (req, res, next) => {
//     const token = req.header("Authorization");
//
//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }
//
//     try {
//         const decoded = jwt.verify(token.replace("Bearer",""), process.env.JWT_SECRET);
//         req.userId = decoded.userId; // Attach userId to request
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };
//
// module.exports = authMiddleware;
