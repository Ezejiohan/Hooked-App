const express = require('express');
const { createSubcategory, getAllSubcategory, getOneSubcategory } = require('../controllers/subcategory');

const subcategoryRoute = express.Router();

subcategoryRoute.post('/subcategories/:categoryId', (createSubcategory));
subcategoryRoute.get('/subcategories', (getAllSubcategory));
subcategoryRoute.get('/subcategories/:id', (getOneSubcategory));

module.exports = subcategoryRoute;