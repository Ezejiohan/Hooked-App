const Level = require('../models/level');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createLevel = asyncWrapper( async (req, res) => {
    // Extract the level name from the request body
    const { levelname } = req.body;
    // Extract category and subcategory IDs from request parameters
    const { categoryId, subcategoryId } = req.params
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
        // If category not found, throw a 404 error
        return next(createCustomError(`Category not found : ${categoryId}`, 404))
    }
    // Find the subcategory by ID
    const subcategory = await Subcategory.findById(subcategoryId)
    if (!subcategory) {
        // If subcategory not found, throw a 404 error
        return next(createCustomError(`Subcategory not found : ${subcategoryId}`, 404))
    }
    // Check if a level with the same name already exists
    const existingLevel = await Level.findOne({ levelname: levelname});
    if (existingLevel) {
        // If level exists, throw a 400 error
        return next(createCustomError(`Level already exists`, 400));
    }
    // Create a new Level instance
    const levelData = new Level({ levelname, category: categoryId, Subcategory: subcategoryId });
     // Add the new level's ID to the category's levels array
    category.level.push(levelData._id);
    // Add the new level's ID to the subcategory's levels array
    subcategory.level.push(levelData._id);
    // Save the updated category
    await category.save();
    // Save the updated subcategory
    await subcategory.save();
     // Save the new level data
    await levelData.save();
    // Respond with the created level data
    res.status(201).json({ levelData });
});

const getAllLevels = asyncWrapper(async (req, res) => {
    // Fetch all levels from the database
    const level = await Level.find({});
    // Respond with the array of all levels
    res.status(200).json({ level });
});

const getLevel = asyncWrapper(async (req, res, next) => {
    // Extract the level ID from request parameters
    const { id } = req.params;
    // Find the level by ID and populate its associated cards
    const level = await Level.findById(id).populate('cards');
    if (!level) {
         // If level not found, throw a 404 error
        return next(createCustomError(`Level not found : ${id}`, 404))
    }
     // Respond with the found level data
    res.status(200).json({level})
});

module.exports = {
    createLevel,
    getAllLevels,
    getLevel
}