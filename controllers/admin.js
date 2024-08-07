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

const adminChangePassword = asyncWrapper(async(req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const {id} = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
        return next(createCustomError(`Admin not found : ${id}`, 404));
    }

    const comparePassword = await bcrypt.compare(oldPassword, admin.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }
    admin.password = hashPassword;

    sendEmail({
        email: admin.email,
        subject: "Password change alert",
        message: "You have changed your password. If not you alert us"
    });
    const result = {
        name: admin.name,
        email: admin.email
    }
    await admin.save();

    return res.status(200).json({ result })
});

const adminForgotPassword = asyncWrapper(async (req, res, next) => {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }
    const token = jwt.sign({
        id: admin._id,
        email: admin.email
    }, process.env.TOKEN, {expiresIn: '30mins'})

    const passwordChangeLink = `${req.protocol}://${req.get("host")}/admin/resetPassword/${admin._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    sendEmail({
        email: admin.email,
        subject: 'Forget password link',
        message: message
    });

    res.status(200).json({
        message: "Email has sent"
    });
});

const adminResetPassword = asyncWrapper(async(req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }
    await jwt.verify(token, process.env.TOKEN)
    

    if (newPassword !== confirmPassword) {
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
    }

    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    const updatePassword = await Admin.findByIdAndUpdate(req.params.id, {
        password: hashPassword
    });

    await admin.save();

    res.status(200).json({updatePassword})
})

module.exports = { 
    signUp, 
    verifyAdmin,
    login, 
    adminChangePassword,
    adminForgotPassword,
    adminResetPassword
}