const express = require('express');
const { createCategory, getAllCategory, getOneCategory } = require('../controllers/category');
const { authenticate } = require('../middleware/adminAuthentication');

const categoryRoute = express.Router();

categoryRoute.get('/', (req, res) => {
    res.send('Hooked-App')
});

categoryRoute.post('/categorys', authenticate, (createCategory));
categoryRoute.get('/categorys', authenticate, (getAllCategory));
categoryRoute.get('/categorys/:id', authenticate, (getOneCategory));

module.exports = categoryRoute;