const express = require('express');

const { signUp, login, verifyAdmin } = require('../controllers/admin');
const adminRoute = express.Router();
adminRoute.get('/', (req, res) => {
    res.send('Hooked-App')
});

adminRoute.post('/admins', (signUp));
adminRoute.get('/admins/verifyAdmin/:id', (verifyAdmin));
adminRoute.post('/admins/log_in', (login));


module.exports = adminRoute;