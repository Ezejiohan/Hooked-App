const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const Cards = require('../models/card');
const {sendEmail} = require('../utilities/nodemailer');

const signUp = asyncWrapper( async (req, res, next) => {
    const {name, email, password } = req.body;
    const emailExist = await Users.findOne({ email })
    if (emailExist) {
        return next(createCustomError(`This email already exist`, 400));
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    const user = await Users.create({
        name,
        email,
        password: hashPassword,
    })
    const verificationLink = "https://hooked-app-7hlg.onrender.com" + '/users/verifyUser/' + user._id;
    const message = `Thanks for registering on Hooked-App. kindly click this link ${verificationLink} to verify your account`;

    const mailOptions = {
        email: user.email,
        subject: "Welcome To Hooked-App",
        message: message
    }
    await sendEmail(mailOptions)

    res.status(201).json({ user });
});

const verifyUser = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const user = await Users.findById(id);
    if (!user) {
        return next(createCustomError(`User not found`, 404))
    }
    if (user.isVerified === true) {
        return next(createCustomError(`User already Verified`, 400));
    }
    const newUser = await Users.findByIdAndUpdate(id, {isVerified: true}, {new: true})
    res.status(200).json({newUser});
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
        } else if (user.isVerified === false) {
            return next(createCustomError(`User is not verified`, 400))
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

const changePassword = asyncWrapper(async(req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const {id} = req.params;
    const user = await Users.findById(id);
    if (!user) {
        return next(createCustomError(`User not found : ${id}`, 404));
    }

    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }
    user.password = hashPassword;

    sendEmail({
        email: user.email,
        subject: "Password change alert",
        message: "You have changed your password. If not you alert us"
    });
    const result = {
        name: user.name,
        email: user.email
    }
    await user.save();

    return res.status(200).json({ result })
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return next(createCustomError(`User not found`, 404));
    }
    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.TOKEN, {expiresIn: '30mins'})

    const passwordChangeLink = `${req.protocol}://${req.get("host")}/user/resetPassword/${user._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    sendEmail({
        email: user.email,
        subject: 'Forget password link',
        message: message
    });

    res.status(200).json({
        message: "Email has sent"
    });
});

const resetPassword = asyncWrapper(async(req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token
    const user = await Users.findById(req.params.id);
    if (!user) {
        return next(createCustomError(`User not found`, 404));
    }
    await jwt.verify(token, process.env.TOKEN)
    

    if (newPassword !== confirmPassword) {
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
    }

    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    const updatePassword = await Users.findByIdAndUpdate(req.params.id, {
        password: hashPassword
    });

    await user.save();

    res.status(200).json({updatePassword})
})

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

const in_Progress = asyncWrapper(async (req, res, next) => {
    
})

module.exports = {
     signUp,
     verifyUser, 
     login,
     changePassword,
     forgotPassword,
     resetPassword,
     getOneUser, 
     studied, 
     skipped 
}