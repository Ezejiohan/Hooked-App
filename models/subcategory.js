const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        
    }
})


const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;