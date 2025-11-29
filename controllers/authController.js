const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const asyncHandler = require('../middleware/async'); 

// Helper function to generate a JWT
const generateToken = (id, role) => {
    // Uses the JWT_SECRET from your .env file
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

// =================================================================
// 1. Sign Up Logic (POST /api/auth/signup)
// =================================================================
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create and Save User (Role defaults to 'User' from the model)
    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // 3. Generate Token for instant login
    const token = generateToken(user._id, user.role);

    // 4. Send success response back to React
    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // Always 'User' on signup
        },
    });
});

// =================================================================
// 2. Login Logic (POST /api/auth/login)
// =================================================================
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Find user and explicitly SELECT the password hash
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare password match using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // Success: Generate Token
        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Could be 'User' or 'Admin'
            },
        });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});
