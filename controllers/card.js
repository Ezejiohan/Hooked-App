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
    const { levelId } = req.params;
    const level = await Level.findById(levelId).populate('cards');
    if (!level) {
        return next(createCustomError(`Level not found: ${levelId}`, 404));
    }
    res.status(200).json({ cards: level.cards });
});

const getCard =asyncWrapper(async (req, res, next) => {
    const { levelId, cardId } = req.params;
    const level = await Level.findById(levelId);
    if (!level) {
        return next(createCustomError(`Level not found: ${levelId}`, 404));
    }

    const card = level.cards.id(cardId); 
    if (!card) {
        return next(createCustomError(`Card not found: ${cardId}`, 404));
    }
    
    res.status(200).json({ card });
})

module.exports = {
    createCard,
    getAllCards,
    getCard
}