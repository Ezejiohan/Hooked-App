const express = require('express');
const { createCard, getAllCards, getCard } = require('../controllers/card');

const cardRoute = express.Router();

cardRoute.post('/cards/:levelId', (createCard));
cardRoute.get('/cards', (getAllCards));
cardRoute.get('/cards/:cardId', (getCard));

module.exports = cardRoute;
