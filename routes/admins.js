const express = require('express');

const { signUp, login } = require('../controllers/admin');
const adminRoute = express.Router();
adminRoute.get('/', (req, res) => {
    res.send('Hooked-App')
});

adminRoute.post('/admins', (signUp));
adminRoute.post('/admins/log_in', (login));

module.exports = adminRoute;