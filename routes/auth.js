// routes/auth.js

const express = require('express');
const router = express.Router();
// Import the functions from the controller file
const { registerUser, loginUser } = require('../controllers/authController');

// Define the Public Routes for Authentication

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post('/signup', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', loginUser);

module.exports = router;
