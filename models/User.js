// models/user.js

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // User's Full Name (for display purposes)
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    // User's Email (used for login and must be unique)
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Ensures no two users share an email
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // HASHED Password (never store the plaintext password)
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Ensures password hash is not returned in queries by default
    },
    // User Role (Critical for your Admin Gate protection)
    role: {
        type: String,
        enum: ['User', 'Admin'], // Only allows these two values
        default: 'User', // Default role for standard signups
    },
    // Token/Reset fields (optional, but good practice for security)
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    // Mongoose will automatically add createdAt and updatedAt fields
    timestamps: true,
});


// Export the model so it can be used in your controllers/routes
const User = mongoose.model('User', userSchema);
module.exports = User;
