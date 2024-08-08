// Define a middleware function for handling requests to non-existent routes
const notFound = (req, res) => 
    // Respond with a 404 status code and a message indicating the route doesn't exist
    res.status(404).send('Route does not exist');

// Export the notFound middleware so it can be used in the application
module.exports = { notFound };
