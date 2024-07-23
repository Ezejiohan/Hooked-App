const Level = require('../models/level');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createLevel = asyncWrapper( async (req, res) => {
    const { levelname, categoryId, subcategoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createCustomError(`Category not found : ${categoryId}`, 404))
    }
    const subcategory = await Subcategory.findById(subcategoryId)
    if (!subcategory) {
        return next(createCustomError(`Subcategory not found : ${subcategoryId}`, 404))
    }
    const levelData = await Level.create({ levelname, category: categoryId, subcategory: subcategoryId });
    await levelData.save()
    res.status(201).json({ levelData });
});

const getAllLevels = asyncWrapper(async (req, res) => {
    const level = await Level.find({});
    res.status(200).json({ level });
});

const getLevel = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const level = await Level.findById(id)
    if (!id) {
        return next(createCustomError(`id not found : ${id}`, 404))
    }
    res.status(200).json({level})
});

module.exports = {
    createLevel,
    getAllLevels,
    getLevel
}