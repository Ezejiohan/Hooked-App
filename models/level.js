const mongoose = require('mongoose');
const Subcategory = require('./subcategory');

const levelSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    Subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    
});

const Level = mongoose.model('Level', levelSchema);
module.exports = Level