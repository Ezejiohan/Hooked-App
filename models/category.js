const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcategory"
    }]
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;