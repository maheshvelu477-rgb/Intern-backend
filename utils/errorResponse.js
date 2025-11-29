/**
 * Custom error class that extends the built-in Error class.
 * This is used to create standardized error responses with specific HTTP status codes
 * across the application, especially within async handler middleware.
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
