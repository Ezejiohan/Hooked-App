// Import necessary modules and dependencies
const jwt = require('jsonwebtoken'); // Used to handle JSON Web Tokens (JWT)
const Users = require('../models/users'); // Import the Users model to interact with the database
const asyncWrapper = require('./async'); // Wrapper to handle async errors
const { createCustomError } = require('../errors/custom_error'); // Custom error handler

// Middleware function to authenticate the user
const authenticateUser = asyncWrapper(async (req, res, next) => {
    // Check if the Authorization header is present in the request
    const hasAuthorization = req.headers.authorization;
    if (!hasAuthorization) {
        // If no Authorization header is found, respond with a 400 status code
        return res.status(400).json({ msg: 'Authorization not found' });
    }

    // Extract the token from the Authorization header
    const token = hasAuthorization.split(' ')[1];

    // Verify the token using the secret key from the environment variables
    const decodedToken = jwt.verify(token, process.env.TOKEN);

    // Find the user in the database using the ID from the decoded token
    const user = await Users.findById(decodedToken.id);
    if (!user) {
        // If the user is not found, throw a custom error with a 404 status code
        return next(createCustomError("User not found", 404));
    }

    // Attach the decoded token (user information) to the request object
    req.user = decodedToken;

    // Continue to the next middleware or route handler
    next();

    // Handle any JWT-related errors that might occur
    if (error instanceof jwt.JsonWebTokenError) {
        return next(createCustomError("Session time out"));
    }
});

// Export the authenticate middleware for use in other parts of the application
module.exports = { authenticateUser };
