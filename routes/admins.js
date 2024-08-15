const express = require('express');

const { signUp, login, verifyAdmin, adminChangePassword, adminForgotPassword, adminResetPassword } = require('../controllers/admin');
const { authenticate } = require('../middleware/adminAuthentication');
const adminRoute = express.Router();
adminRoute.get('/', (req, res) => {
    res.send('Hooked-App')
});

adminRoute.post('/admins', (signUp));
adminRoute.get('/admins/verifyAdmin/:id', (verifyAdmin));
adminRoute.post('/admins/log_in', (login));
adminRoute.put('/admins/changePassword/:id', authenticate, (adminChangePassword));
adminRoute.post('/admins/forgotPassword', (adminForgotPassword));
adminRoute.patch('/admins/resetPassword/:id/:token', (adminResetPassword));

module.exports = adminRoute;