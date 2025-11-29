// config/db.js
const mongoose = require('mongoose');    // Import mongoose to interact with MongoDB

const connectDB = async () => {             // Async function to connect to the database
    try {                                   // Try block to handle potential errors
        const conn = await mongoose.connect(process.env.MONGO_URI);       // Connect to MongoDB using the connection string from environment variables
        console.log(`MongoDB Connected: ${conn.connection.host}`);        // Log success message with the host name
    } catch (error) {                   // Catch block to handle errors
        console.error(`Error: ${error.message}`);          //  Log the error message
        // Exit process with failure   
        process.exit(1);        
    }
};

module.exports = connectDB;           // Export the connectDB function for use in other files
