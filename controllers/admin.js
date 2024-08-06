const Admin = require('../models/admins');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');
const {sendEmail} = require('../utilities/nodemailer');

const signUp = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    const emailExist = await Admin.findOne({ email })
    if (emailExist) {
        return next(createCustomError(`This email already exist`, 400));
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const admin = await Admin.create({
        name,
        email,
        password: hashPassword,
    })
    const verificationLink = "https://hooked-app-7hlg.onrender.com" + '/admins/verifyAdmin/' + admin._id;
    const message = `Thanks for registering on Hooked-App. kindly click this link ${verificationLink} to verify your account`;
    const mailOptions =  {
        email: admin.email,
        subject: "Welcome To Hooked-App",
        message: message
    }
    await sendEmail(mailOptions);

    res.status(201).json({ admin });
});

const verifyAdmin = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404))
    }
    if (admin.isVerified === true) {
        return next(createCustomError(`Admin already Verified`, 400));
    }
    const newAdmin = await Admin.findByIdAndUpdate(id, {isVerified: true}, {new: true})
    res.status(200).json({newAdmin});
})

const login = asyncWrapper(async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}
    const admin = await Admin.findOne({ email: req.body.email});
    if (!admin) {
        return next(createCustomError("Admin not found", 404));
    } else {
        const correctPassword = await bcrypt.compare(loginRequest.password, admin.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else if (admin.isVerified === false) {
            return next(createCustomError(`Admin is not verified`, 400)) 
        } else {
            const generatedToken = jwt.sign({
                id: admin._id,
                email: admin.email,
            }, process.env.TOKEN, { expiresIn: '12h'})
            const result = {
                id: admin._id,
                email: admin.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

module.exports = { 
    signUp, 
    verifyAdmin,
    login }