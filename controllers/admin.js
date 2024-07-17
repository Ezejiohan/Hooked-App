const Admin = require('../models/admins');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const signUp = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const admin = await Admin.create({
        name,
        email,
        password: hashPassword,
    })
    res.status(201).json({ admin });
});

const login = asyncWrapper(async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}
    const admin = await Admin.findOne({ email: req.body.email});
    if (!admin) {
        return next(createCustomError("Admin not found", 404));
    } else {
        const correctPassword = await bcrypt.compare(loginRequest.password, admin.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else {
            const generatedToken = jwt.sign({
                id: admin._id,
                email: admin.email,
            }, process.env.secretKey, { expiresIn: '12h'})
            const result = {
                id: admin._id,
                email: admin.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

module.exports = { signUp, login }