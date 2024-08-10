// Import the CustomAPIError class from the custom_error module
const { CustomAPIError } = require('../errors/custom_error');

// Define an error handling middleware function
const errorHandlerMiddleware = (err, req, res, next) => {
    // Check if the error is an instance of CustomAPIError
    if (err instanceof CustomAPIError) {
        // If it is, respond with the error's status code and message
        return res.status(err.statusCode).json({ msg: err.message });
    }
    // Handle any JWT-related errors that might occur
    if (err instanceof jwt.JsonWebTokenError) {
         return next(createCustomError("Session time out"));
    }
    // If the error is not a CustomAPIError, respond with a generic 500 status code
    return res.status(500).json({
        msg: `Something went wrong, try again later`,
    });
};

// Export the error handling middleware so it can be used in the application
module.exports = {errorHandlerMiddleware};
