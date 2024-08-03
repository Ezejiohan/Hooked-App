const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subcategoryname: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    level: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    }]
});


const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;