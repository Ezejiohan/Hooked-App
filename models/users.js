const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'must provide a firstname'],
        trim: true,
        maxlength: [15, 'firstname must not be more than 10 characters']
    },
    lastname: {
        type: String,
        required: [true, 'must provide a lastname'],
        trim: true,
        maxlength: [15, 'lastname must not be less than 15 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must be 8 characters long and include at least one uppercase and one special character']
    }
}, {
    timestamps: true
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;