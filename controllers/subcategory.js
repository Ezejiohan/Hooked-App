const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createSubcategory = asyncWrapper(async (req, res) => {
    // Extract the category ID from request parameters
    const {categoryId} = req.params;
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
         // If category not found, throw a 404 error
        return next(createCustomError(`category not found : ${categoryId}`, 404))
    }
    // Extract the subcategory name from the request body
    const {subcategoryname} = req.body;
    // Create a new Subcategory instance with the provided name
    const subcategoryData = new Subcategory({subcategoryname});
    // Associate the new subcategory with the category ID
    subcategoryData.category = categoryId
    // Associate the new subcategory with the category ID
    category.subCategories.push(subcategoryData._id)
    // Save the new subcategory data
    await subcategoryData.save();
     // Save the updated category data
    await category.save()
     // Respond with the created subcategory data
    res.status(201).json({subcategoryData})
});

const getAllSubcategory = asyncWrapper(async (req, res) => {
    // Fetch all subcategories and populate the associated category data
    const subcategory = await Subcategory.find({}).populate('level');
    // Respond with the array of all subcategories
    res.status(200).json({subcategory})
});

const getOneSubcategory = asyncWrapper(async (req, res) => {
    // Extract the subcategory ID from request parameters
    const {id} = req.params;
    // Find the subcategory by ID and populate its associated category
    const subcategory = await Subcategory.findById(id).populate('level');
    if (!subcategory) {
        // If subcategory not found, throw a 404 error
        return next(createCustomError(`subcategory not found : ${id}`, 404))
    }
    // Respond with the found subcategory data
    res.status(200).json({subcategory})
});

module.exports = { createSubcategory, 
    getAllSubcategory,
    getOneSubcategory
 }