const express = require('express');
const { createLevel, getAllLevels, getLevel } = require('../controllers/level');
const { authenticate } = require('../middleware/adminAuthentication');

const levelRoute = express.Router();

levelRoute.post('/levels/:categoryId/:subcategoryId', authenticate, (createLevel));
levelRoute.get('/levels', authenticate, (getAllLevels));
levelRoute.get('/levels/:id', authenticate, (getLevel));

module.exports = levelRoute;