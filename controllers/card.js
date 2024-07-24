const Cards = require('../models/card');
const Level = require('../models/level');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createCard = asyncWrapper(async(req, res, next) => {
    const { levelId, cardName, cardDescription, question, answer } = req.body;
    const level = await Level.findById(levelId);
    if (!level) {
        return next(createCustomError(`Level not found : ${levelId}`, 404));
    }
    const cardData = await Cards.create({ level: levelId, cardName, cardDescription, question, answer});
    level.cards.push(cardData._id);
    await cardData.save();
    res.status(201).json({ cardData })
});

const getAllCards = asyncWrapper(async (req, res) => {
    const cards = await Cards.find({}).populate('level');
    res.status(200).json({cards});
});

const getCard =asyncWrapper(async (req, res, next) => {
    
})

module.exports = {
    createCard
}