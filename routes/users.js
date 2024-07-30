const express = require('express');
const { 
    signUp, 
    login, 
    studied, 
    skipped 
} = require('../controllers/user');

const route = express.Router();
route.get('/', (req, res) => {
    res.send('Hooked-APP')
});

route.post('/users', (signUp));
route.post('/users/log-in', (login));
route.post('/users/:userId/studied/:cardId', (studied));
route.post('/users/:userId/skipped/:cardId', (skipped))

module.exports = route;

    