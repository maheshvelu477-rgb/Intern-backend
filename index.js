const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); 
const path = require('path'); 

// Load env vars
dotenv.config({ path: './.env' });

// Route files
const courseRoutes = require('./routes/Courses'); 
const mentorRoutes = require('./routes/Mentors'); 
// 1. IMPORT AUTHENTICATION ROUTES
const authRoutes = require('./routes/auth'); 


// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// CORS Setup
app.use(cors()); 

// Static Folder Setup for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 

// Mount routers

app.use('/api/v1/courses', courseRoutes); 
app.use('/api/v1/mentors', mentorRoutes); 
// 2. MOUNT AUTHENTICATION ROUTES
// We'll use '/api/auth' for cleaner endpoint structure (e.g., /api/auth/signup)
app.use('/api/auth', authRoutes); 

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 8000;

const server = app.listen(
    PORT,
    () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1)); 
});
