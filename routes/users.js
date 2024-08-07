const express = require('express');
const { 
    signUp, 
    login, 
    studied, 
    skipped, 
    getOneUser,
    verifyUser,
    changePassword,
    forgotPassword,
    resetPassword,
    inProgress,
    getAllStudied,
    getAllSkipped,
    getAllInProgress
} = require('../controllers/user');

const route = express.Router();
route.get('/', (req, res) => {
    res.send('Hooked-APP')
});

route.post('/users', (signUp));
route.get('/users/verifyUser/:id', (verifyUser));
route.post('/users/log-in', (login));
route.put('/users/changePassword/:id', (changePassword));
route.post('/users/forgotPassword', (forgotPassword));
route.patch('/users/resetPassword/:id/:token', (resetPassword));
route.get('/users/:id', (getOneUser));
route.post('/users/:userId/studied/:cardId', (studied));
route.post('/users/:userId/skipped/:cardId', (skipped));
route.post('/users/:userId/inProgress/:cardId', (inProgress));
route.get('/users/studied/:userId', (getAllStudied));
route.get('/users/skipped/:userId', (getAllSkipped));
route.get('/users/inProgress/:userId', (getAllInProgress));

module.exports = route;