const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createCategory = asyncWrapper(async (req, res) => {
    // Extract category name from the request body
    const { categoryName } = req.body;
    // Create a new category with the provided name
    const categoryData = await Category.create({categoryName});
    // Respond with the created category data
    res.status(201).json({categoryData});
});

const getAllCategory = asyncWrapper(async (req, res) => {
    // Fetch all categories from the database
    const category = await Category.find({}).populate('subcategories');
    // Respond with the array of all categories
    res.status(200).json({category})
});

const getOneCategory = asyncWrapper(async (req, res) => {
    // Get category ID from request parameters
    const {id} = req.params;
    // Find the category by ID
    const category = await Category.findById(id).populate('subcategories');
    if (!category) {
        // If category not found, throw a 404 error
        return next(createCustomError(`category not found : ${id}`, 404))
    }
     // Respond with the found category data
    res.status(200).json({category})
})

module.exports = { createCategory,
    getAllCategory,
    getOneCategory
 } 