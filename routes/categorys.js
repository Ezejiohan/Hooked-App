const express = require('express');
const { createCategory, getAllCategory, getOneCategory } = require('../controllers/category');

const categoryRoute = express.Router();

categoryRoute.get('/', (req, res) => {
    res.send('Hooked-App')
});

categoryRoute.post('/categorys', (createCategory));
categoryRoute.get('/categorys', (getAllCategory));
categoryRoute.get('/categorys/:id', (getOneCategory));

module.exports = categoryRoute;