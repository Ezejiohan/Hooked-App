const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom_error');
const Cards = require('../models/card');
const {sendEmail} = require('../utilities/nodemailer');

// User signUp controller
const signUp = asyncWrapper( async (req, res, next) => {
    const {name, email, password } = req.body;

    // Check if email already exist
    const emailExist = await Users.findOne({ email })
    if (emailExist) {
        return next(createCustomError(`This email already exist`, 400));
    }

    // Hash user's password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

    // Create a new user
    const user = await Users.create({
        name,
        email,
        password: hashPassword,
    })

    // Generate a verification link for a user
    const verificationLink = "https://hooked-app-7hlg.onrender.com" + '/users/verifyUser/' + user._id;
    const message = `Thanks for registering on Hooked-App. kindly click this link ${verificationLink} to verify your account`;

    // Send a verification email
    const mailOptions = {
        email: user.email,
        subject: "Welcome To Hooked-App",
        message: message
    }
    await sendEmail(mailOptions)

    // Respond with the created user
    res.status(201).json({ user });
});

// User verification controller
const verifyUser = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;

    // Find the user by Id
    const user = await Users.findById(id);
    if (!user) {
        return next(createCustomError(`User not found`, 404))
    }

    // Check if user is already verified
    if (user.isVerified === true) {
        return next(createCustomError(`User already Verified`, 400));
    }

    // Update user's verification status
    const newUser = await Users.findByIdAndUpdate(id, {isVerified: true}, {new: true})
    res.status(200).json({newUser});
})

// User login controller
const login = asyncWrapper( async (req, res, next) => {
    const loginRequest = { email: req.body.email, password: req.body.password}

    // Find the user by email
    const user = await Users.findOne({ email: req.body.email});
    if (!user) {
        return next(createCustomError("User not found", 404));
    } else {
        // Verify the password
        const correctPassword = await bcrypt.compare(loginRequest.password, user.password);
        if (correctPassword === false) {
            return next(createCustomError('Invalid email or password', 404))
        } else if (user.isVerified === false) {
            return next(createCustomError(`User is not verified`, 400))
        } else {
            // Generate a jwt token
            const generatedToken = jwt.sign({
                id: user._id,
                email: user.email,
            }, process.env.TOKEN, { expiresIn: '12h'})

            // Respond with user info and token
            const result = {
                id: user._id,
                email: user.email,
                token: generatedToken
            }
            return res.status(200).json({result});
        }
    }
});

// Change password controller
const changePassword = asyncWrapper(async(req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const {id} = req.params;

    // Find user by ID
    const user = await Users.findById(id);
    if (!user) {
        return next(createCustomError(`User not found : ${id}`, 404));
    }

    // Compare old password
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (comparePassword !== true) {
        return next(createCustomError(`Password incorrect`, 404))
    }

    // Hash the new password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    // Check if new password is same as old password
    if (newPassword === oldPassword) {
        return next(createCustomError(`Unauthorised`, 404))
    }

    // Update user's password
    user.password = hashPassword;

    // Send email notification about password change
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

// Forgot password controller
const forgotPassword = asyncWrapper(async (req, res, next) => {
    // Find the user by email
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return next(createCustomError(`User not found`, 404));
    }
    // Generate a token for password reset
    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.TOKEN, {expiresIn: '30mins'})

    // Generate a password reset link
    const passwordChangeLink = `${req.protocol}://${req.get("host")}/user/resetPassword/${user._id}/${token}`;
    const message = `Click this link: ${passwordChangeLink} to set a new password`;

    // Send the reset password email
    sendEmail({
        email: user.email,
        subject: 'Forget password link',
        message: message
    });

    res.status(200).json({
        message: "Email has sent"
    });
});

// Reset password controller
const resetPassword = asyncWrapper(async(req, res, next) => {
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token

    // Find user by ID
    const user = await Users.findById(req.params.id);
    if (!user) {
        return next(createCustomError(`User not found`, 404));
    }
    // Verify the token
    await jwt.verify(token, process.env.TOKEN)
    
    // Check if the new password matches the confirmation
    if (newPassword !== confirmPassword) {
        return res.status(403).json({
            message: 'There is a difference in both password'
        });
    }

    // Hash the new password
    const saltPassword = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

    // Update the user's password
    const updatePassword = await Users.findByIdAndUpdate(req.params.id, {
        password: hashPassword
    });

    await user.save();

    res.status(200).json({updatePassword})
});

// Get one user by ID controller
const getOneUser = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    // Find user by ID
    const user = await Users.findById(id)
    if (!user) {
        return next(createCustomError(`User not found : ${id}`, 404))
    }
    res.status(200).json({user})
});

// Add a card to the studied list controller
const studied = asyncWrapper( async (req, res, next) => {
    const { userId, cardId } = req.params;
    // Find the user by ID
    const user = await Users.findById(req.params.userId)
    if (!user) {
        // If user not found, return 404 error
        return next(createCustomError('User not found', 404));
    }
    // Find the card by ID
    const card = await Cards.findById(cardId);
    if (!card) {
        // If card not found, return 404 error
        return next(createCustomError('Card not found', 404));
    }

    // Remove the card from skipped list if present
    const cardIndex = user.skipped.findIndex(item => item.toString() === cardId);
    if (cardIndex !== -1) {
        // Remove the card from skipped list
        user.skipped.splice(cardIndex, 1);
    }
    // Remove the card from inProgress list if present and add to studied list
    const cardIndexInProgress = user.inProgress.indexOf(cardId);
    if (cardIndexInProgress !== -1) {
        // Remove the card from inProgress list
        user.inProgress.splice(cardIndexInProgress, 1); 
        // Add the card to studied list
        user.studied.push(cardId); 
    }

    // Add the card to the studied list if not already present
    if (!user.studied.some(item => item.toString() === cardId)) {
        user.studied.push(cardId);
    }
    // Save the updated user data
    await user.save();
    // Send a response indicating success
    res.status(200).json({ message: 'Card added to studied list', user });
});

// Add a card to the skipped list controller
const skipped = asyncWrapper(async (req, res, next) => {
    const { userId, cardId } = req.params;

    // Find the user by ID
    const user = await Users.findById(userId);
    if (!user) {
        // If user not found, return 404 error
        return next(createCustomError('User not found', 404));
    }

    // Remove the card from the inProgress list if present
    const cardIndexInProgress = user.inProgress.indexOf(cardId);
    if (cardIndexInProgress !== -1) {
        // Remove the card from inProgress list
        user.inProgress.splice(cardIndexInProgress, 1); 
    }

    // Add the card to the skipped list
    user.skipped.push({ cardId });
    // Save the updated user data
    await user.save();

    // Send a response indicating success
    res.status(200).json({ message: 'Card added to skipped list', user });
});

// Add a card to the in-progress list controller
const inProgress = asyncWrapper(async (req, res, next) => {
    const { userId, cardId } = req.params;

    // Find the user by ID
    const user = await Users.findById(userId);
    if (!user) {
        return next(createCustomError('User not found', 404));
    }
    // Find card by ID
    const card = await Cards.findById(cardId)
    if (!card) {
        return next(createCustomError('Card not found', 404));
    }
    // Add the card to the in-progress list if not already present
    if (!user.inProgress.includes(cardId)) {
        user.inProgress.push(cardId);
    }
     // Save the updated user data
    await user.save();
    // Send a response indicating success
    res.status(200).json({ message: 'Card added to in-progress list', user });
});

// Get all cards in the studied list controller
const getAllStudied = asyncWrapper(async(req, res, next) => {
    const { userId } = req.params;
    // Find the user by ID
    const user = await Users.findById(userId).populate('studied');
    if (!user) {
        // If user not found, return 404 error
        return next(createCustomError('User not found', 404));
    }

    // Retrieve the studied cards list
    const studiedCards = user.studied;

    // Send a response with the studied cards list
    res.status(200).json({ studiedCards });
});

// Get all cards in the skipped list controller
const getAllSkipped = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    // Find the user by ID
    const user = await Users.findById(userId).populate('skipped');
    if (!user) {
        // If user not found, return 404 error
        return next(createCustomError('User not found', 404));
    }

    // Retrieve the skipped cards list
    const skippedCards = user.skipped;

    // Send a response with the skipped cards list
    res.status(200).json({ skippedCards });
});

// Get all cards in the in-progress list controller
const getAllInProgress = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;

    // Find the user by ID
    const user = await Users.findById(userId).populate('inProgress');
    if (!user) {
        // If user not found, return 404 error
        return next(createCustomError('User not found', 404));
    }

    // Retrieve the in-progress cards list
    const inProgressCards = user.inProgress;

    // Send a response with the in-progress cards list
    res.status(200).json({ inProgressCards });
});


module.exports = {
     signUp,
     verifyUser, 
     login,
     changePassword,
     forgotPassword,
     resetPassword,
     getOneUser, 
     studied, 
     skipped, 
     inProgress,
     getAllStudied,
     getAllSkipped,
     getAllInProgress
}