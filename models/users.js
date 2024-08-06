const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide a name'],
        trim: true,
        maxlength: [25, 'name must not be more than 20 characters']        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password must be 8 characters long and include at least one uppercase and one special character']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    studied: [
        {
            cardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Card'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    skipped: [
        {
            cardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Card'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
    
}, {
    timestamps: true
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;