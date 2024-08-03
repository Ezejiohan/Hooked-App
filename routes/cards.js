const express = require('express');
const { createCard } = require('../controllers/card');

const cardRoute = express.Router();

cardRoute.post('/cards/:levelId', (createCard));

module.exports = cardRoute;
