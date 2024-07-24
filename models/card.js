const mongoose = require('mongoose');

const cardsSchema = new mongoose.Schema({
    level: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    cardDescription: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
})

const Cards = mongoose.model('Cards', cardsSchema);
module.exports = Cards;