const mongoose = require('mongoose');
const Subcategory = require('./subcategory');

const levelSchema = new mongoose.Schema({
    levelname: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    Subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    cards: []

});

const Level = mongoose.model('Level', levelSchema);
module.exports = Level