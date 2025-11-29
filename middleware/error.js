// middleware/error.js

const errorHandler = (err, req, res, next) => {
    // Log the error stack to the console for debugging
    console.error(err.stack);

    // Set a default status code and message
    let error = { ...err };
    error.message = err.message;

    // Handle Mongoose Validation Errors (Status 400: Bad Request)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error.message = messages.join(', ');
        error.statusCode = 400;
    }

    // Handle Mongoose Duplicate Key Errors (Status 400: Bad Request)
    // This typically catches unique fields like email in your User model
    if (err.code === 11000) {
        error.message = `Duplicate field value entered: ${Object.keys(err.keyValue)} must be unique.`;
        error.statusCode = 400;
    }

    // Default to 500 status code if not otherwise set
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
