/**
 * Simple wrapper for async functions to catch errors and pass them to Express's 
 * error handler (`next`). This allows us to avoid writing try/catch blocks 
 * in every single controller function.
 * * @param {Function} fn - The async controller function to wrap.
 */
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

