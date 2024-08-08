const express = require('express');
const { createCard, getAllCards, getCard } = require('../controllers/card');
const { authenticate } = require('../middleware/adminAuthentication');

const cardRoute = express.Router();

cardRoute.post('/cards/:levelId', authenticate, (createCard));
cardRoute.get('/cards', authenticate, (getAllCards));
cardRoute.get('/cards/:cardId', authenticate, (getCard));

module.exports = cardRoute;
