// Define an asyncWrapper function that takes another function (fn) as an argument
const asyncWrapper = (fn) => {
    // Return a new function that is asynchronous and handles the request, response, and next middleware
    return async (req, res, next) => {
        try {
            // Try to execute the passed function with the current request, response, and next middleware
            await fn(req, res, next);
        } catch (error) {
            // If an error occurs during the execution, log the error to the console
            console.log(error);

            // Check if the error is an instance of jwt.JsonWebTokenError (related to JWT token issues)
            if (error instanceof jwt.JsonWebTokenError) {
                // If it is a JWT error, send a response indicating the link has expired
                res.json('Link has expired');
            }

            // Pass the error to the next middleware or error handler
            next(error);
        }
    };
};

// Export the asyncWrapper function so it can be used to wrap other functions in the application
module.exports = asyncWrapper;
