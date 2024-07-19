const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createCategory = asyncWrapper(async (req, res) => {
    const { categoryName } = req.body;
    const categoryData = await Category.create({categoryName});
    res.status(201).json({categoryData});
});

const getAllCategory = asyncWrapper(async (req, res) => {
    const category = await Category.find({}).populate('subcategories');
    res.status(200).json({category})
});

const getOneCategory = asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const category = await Category.findById(id).populate('subcategories')
    if (!category) {
        return next(createCustomError(`category not found : ${id}`, 404))
    }
    res.status(200).json({category})
});

module.exports = { createCategory,
    getAllCategory,
    getOneCategory
 } 