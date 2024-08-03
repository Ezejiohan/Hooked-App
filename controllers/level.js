const Level = require('../models/level');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createLevel = asyncWrapper( async (req, res) => {
    const { levelname } = req.body;
    const { categoryId, subcategoryId } = req.params
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createCustomError(`Category not found : ${categoryId}`, 404))
    }
    const subcategory = await Subcategory.findById(subcategoryId)
    if (!subcategory) {
        return next(createCustomError(`Subcategory not found : ${subcategoryId}`, 404))
    }
    const existingLevel = await Level.findOne({ levelname: levelname});
    if (existingLevel) {
        return next(createCustomError(`Level already exists`, 400));
    }
    const levelData = new Level({ levelname, category: categoryId, Subcategory: subcategoryId });
    category.level.push(levelData._id);
    subcategory.level.push(levelData._id);
    await category.save();
    await subcategory.save();
    await levelData.save();
    res.status(201).json({ levelData });
});

const getAllLevels = asyncWrapper(async (req, res) => {
    const level = await Level.find({})
    res.status(200).json({ level });
});

const getLevel = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const level = await Level.findById(id).populate('cards');
    if (!level) {
        return next(createCustomError(`Level not found : ${id}`, 404))
    }
    res.status(200).json({level})
});

module.exports = {
    createLevel,
    getAllLevels,
    getLevel
}