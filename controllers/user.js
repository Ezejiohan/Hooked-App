const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');

const signUp = asyncWrapper( async (req, res) => {
    const {name, email, password } = req.body;
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const user = await Users.create({
        name,
        email,
        password: hashPassword,
    })
    res.status(201).json({ user });
})

const login = asyncWrapper( async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}
    const user = await Users.findOne({ email: req.body.email});
    if (!user) {
        return next(createCustomError("User not found", 404));
    } else {
        const correctPassword = await bcrypt.compare(loginRequest.password, user.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else {
            const generatedToken = jwt.sign({
                id: user._id,
                email: user.email,
            }, process.env.TOKEN, { expiresIn: '12h'})
            const result = {
                id: user._id,
                email: user.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

module.exports = { signUp, login}