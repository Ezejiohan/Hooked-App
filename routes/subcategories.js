const express = require('express');
const { createSubcategory, getAllSubcategory, getOneSubcategory } = require('../controllers/subcategory');
const { authenticate } = require('../middleware/adminAuthentication');

const subcategoryRoute = express.Router();

subcategoryRoute.post('/subcategories/:categoryId', authenticate, (createSubcategory));
subcategoryRoute.get('/subcategories', authenticate, (getAllSubcategory));
subcategoryRoute.get('/subcategories/:id', authenticate, (getOneSubcategory));

module.exports = subcategoryRoute;