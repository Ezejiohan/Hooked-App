const Admin = require('../models/admins');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');
const {sendEmail} = require('../utilities/nodemailer');

// Admin signUp controller
const signUp = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    // Check if email already exist
    const emailExist = await Admin.findOne({ email })
    if (emailExist) {
        return next(createCustomError(`This email already exist`, 400));
    }

    // Hash admin's password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    // Create new admin
    const admin = await Admin.create({
        name,
        email,
        password: hashPassword,
    });
    // Generate verification link for admin
    const verificationLink = "https://hooked-app-7hlg.onrender.com" + '/admins/verifyAdmin/' + admin._id;
    const message = `Thanks for registering on Hooked-App. kindly click this link ${verificationLink} to verify your account`;

    // Email options and sending verification email
    const mailOptions =  {
        email: admin.email,
        subject: "Welcome To Hooked-App",
        message: message
    }
    await sendEmail(mailOptions);

    // Respond with the created admin
    res.status(201).json({ admin });
});

// Admin verification controller
const verifyAdmin = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    // Find Admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404))
    }
    // Check if admin is already verified
    if (admin.isVerified === true) {
        return next(createCustomError(`Admin already Verified`, 400));
    }
    // Update admin's verification status
    const newAdmin = await Admin.findByIdAndUpdate(id, {isVerified: true}, {new: true})
    res.status(200).json({newAdmin});
});

// Admin login controller
const login = asyncWrapper(async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}
    // Find admin by email
    const admin = await Admin.findOne({ email: req.body.email});
    if (!admin) {
        return next(createCustomError("Admin not found", 404));
    } else {
        // Verify the password
        const correctPassword = await bcrypt.compare(loginRequest.password, admin.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else if (admin.isVerified === false) {
            return next(createCustomError(`Admin is not verified`, 400)) 
        } else {
            // Generate a jwt token
            const generatedToken = jwt.sign({
                id: admin._id,
                email: admin.email,
            }, process.env.TOKEN, { expiresIn: '12h'});

            // Respond with admin info and token
            const result = {
                id: admin._id,
                email: admin.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

// Admin change password controller
const adminChangePassword = asyncWrapper(async(req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const {id} = req.params;
    // Find admin by ID
    const admin = await Admin.findById(id);
    if (!admin) {
        return next(createCustomError(`Admin not found : ${id}`, 404));
    }

    // Compare the old password
    const comparePassword = await bcrypt.compare(oldPassword, admin.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }
    // Hash the new password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    // Check if new password is the same as the old password
    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }
    // Update admin's password
    admin.password = hashPassword;

    // Send email notification about password change
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

// Admin forgot password controller
const adminForgotPassword = asyncWrapper(async (req, res, next) => {
    // Find admin by email
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }
// Generate a token for password reset
    const token = jwt.sign({
        id: admin._id,
        email: admin.email
    }, process.env.TOKEN, {expiresIn: '30mins'})

    // Generate a password reset link
    const passwordChangeLink = `${req.protocol}://${req.get("host")}/admin/resetPassword/${admin._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    // Send the reset password email
    sendEmail({
        email: admin.email,
        subject: 'Forget password link',
        message: message
    });

    res.status(200).json({
        message: "Email has sent"
    });
});

// Admin reset password controller
const adminResetPassword = asyncWrapper(async(req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token;
    // Find admin by ID
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        return next(createCustomError(`Admin not found`, 404));
    }
    // Verify the token
    await jwt.verify(token, process.env.TOKEN)
    
    // Check if the new password matches the confirmation
    if (newPassword !== confirmPassword) {
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
    }
    // Hash new password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);
    // Updates the admin's password
    const updatePassword = await Admin.findByIdAndUpdate(req.params.id, {
        password: hashPassword
    });

    await admin.save();

    res.status(200).json({updatePassword})
});

module.exports = { 
    signUp, 
    verifyAdmin,
    login, 
    adminChangePassword,
    adminForgotPassword,
    adminResetPassword
}