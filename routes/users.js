const express = require('express');
const { signUp, login } = require('../controllers/user');

const route = express.Router();
route.get('/', (req, res) => {
    res.send('Hooked-APP')
});

route.post('/users', (signUp));
route.post('/users/log-in', (login));

module.exports = route;

    