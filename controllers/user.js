const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const Cards = require('../models/card');

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

const getOneUser = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const user = await Users.findById(id)
    if (!user) {
        return next(createCustomError(`User not found : ${id}`, 404))
    }
    res.status(200).json({user})
});

const studied = asyncWrapper( async (req, res, next) => {
    const { userId, cardId } = req.params;
    const user = await Users.findById(req.params.userId)
    if (!user) {
        return next(createCustomError('User not found', 404));
    }
    const card = await Cards.findById(cardId);
    if (!card) {
        return next(createCustomError('Card not found', 404));
    }
    const cardIndex = user.skipped.findIndex(item => item.toString() === cardId);
    if (cardIndex !== -1) {
        user.skipped.splice(cardIndex, 1);
    }

    if (!user.studied.some(item => item.toString() === cardId)) {
        user.studied.push(cardId);
    }

    await user.save();

    res.status(200).json({ message: 'Card added to studied list', user });
});

const skipped = asyncWrapper(async (req, res, next) => {
    const { userId, cardId } = req.params;

    const user = await Users.findById(userId);
    if (!user) {
        return next(createCustomError('User not found', 404));
    }
    user.skipped.push({ cardId });
    await user.save();

    res.status(200).json({ message: 'Card added to skipped list', user });
});

const getAllStudied = asyncWrapper(async(req, res) => {
    const studied = await Users.find({});
})

module.exports = {
     signUp, 
     login,
     getOneUser, 
     studied, 
     skipped 
}