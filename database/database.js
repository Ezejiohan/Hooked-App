// Import the mongoose library to interact with MongoDB
const mongoose = require('mongoose');
// Load environment variables from a .env file into process.env
require('dotenv').config();

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
       await mongoose.connect(process.env.MONGO_URI, {
        });
       // Log a message to the console if the connection is successful
       console.log('MongoDB connected...'); 
    } catch (error) {
        // If an error occurs during the connection attempt, log the error message
        console.error(error.message);
        // Exit the process with a failure code (1) if the connection fails
        process.exit(1);
    }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;