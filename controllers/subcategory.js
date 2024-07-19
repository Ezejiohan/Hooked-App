const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createSubcategory = asyncWrapper(async (req, res) => {
    const {categoryId} = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
        return next(createCustomError(`category not found : ${categoryId}`, 404))
    }
    const {subcategoryname} = req.body;
    const subcategoryData = new Subcategory({subcategoryname});
    subcategoryData.category = categoryId
    category.subCategories.push(subcategoryData._id)
    await subcategoryData.save();
    await category.save()
    res.status(201).json({subcategoryData})
});

const getAllSubcategory = asyncWrapper(async (req, res) => {
    const subcategory = await Subcategory.find({}).populate('category')
    res.status(200).json({subcategory})
});

const getOneSubcategory = asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const subcategory = await Subcategory.findById(id).populate('category')
    if (!subcategory) {
        return next(createCustomError(`subcategory not found : ${id}`, 404))
    }
    res.status(200).json({subcategory})
});

module.exports = { createSubcategory, 
    getAllSubcategory,
    getOneSubcategory
 }