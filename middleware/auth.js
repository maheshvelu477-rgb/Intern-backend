// middleware/auth.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');

// Middleware to protect routes (ensure user is logged in)
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header (e.g., 'Bearer <token>')
        token = req.headers.authorization.split(' ')[1];
    }
    // Alternatively, you could check for a token in cookies if you used that method

    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route. No token.' });
    }

    try {
        // Verify token and extract payload (id and role)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user object to the request for use in controllers
        // Note: We don't select the password here
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ success: false, message: 'Not authorized to access this route. Token failed.' });
    }
});

// Middleware to authorize user roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // e.g., A 'User' tries to access an 'Admin' route
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route.` 
            });
        }
        next();
    };
};
