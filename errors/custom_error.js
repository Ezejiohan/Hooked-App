

// Define a custom error class that extends the built-in Error class
class CustomAPIError extends Error {
    // Constructor takes a message and a status code as parameters
    constructor(message, statusCode) {
        // Call the constructor of the parent Error class with the message
        super(message);
        // Attach the status code to the custom error object
        this.statusCode = statusCode;
    }
}

// Function to create a new CustomAPIError instance
const createCustomError = (msg, statusCode) => {
    // Returns a new instance of CustomAPIError with the provided message and status code
    return new CustomAPIError(msg, statusCode);
}

// Export the CustomAPIError class and createCustomError function for use in other parts of the application
module.exports = { createCustomError, CustomAPIError };
