// Import mongoose library for MongoDB interaction
const mongoose = require('mongoose');

// Define a schema for the 'Admin' model using mongoose.Schema
const adminSchema = new mongoose.Schema({
    // Define 'name' field with validation rules
    name: {
        type: String, // Data type is String
        required: [true, 'must provide a name'], // Field is required with a custom error message if not provided
        trim: true, // Automatically trim whitespace from the beginning and end of the string
        maxlength: [25, 'name must not be more than 20 characters'] // Maximum length of the name is 25 characters with a custom error message
    },
    // Define 'email' field with validation rules
    email: {
        type: String, // Data type is String
        required: true, // Field is required
        unique: true // Ensures that each email is unique in the database
    },
    // Define 'password' field with validation rules
    password: {
        type: String, // Data type is String
        required: [true, 'password must be 8 characters long and include at least one uppercase and one special character'] // Field is required with a custom error message
    },
    // Define 'isVerified' field with a default value
    isVerified: {
        type: Boolean, // Data type is Boolean
        default: false // Default value is false, meaning admin accounts are not verified by default
    }
    
}, { 
    // Add timestamps to the schema, automatically adding 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Create a Mongoose model named 'Admin' using the defined schema
const Admin = mongoose.model('Admin', adminSchema);

// Export the Admin model so it can be used in other parts of the application
module.exports = Admin;
