const express = require('express');
const { createLevel, getAllLevels, getLevel } = require('../controllers/level');

const levelRoute = express.Router();

levelRoute.post('/levels', (createLevel));
levelRoute.get('/levels', (getAllLevels));
levelRoute.get('/levels/:id', (getLevel));

module.exports = levelRoute;