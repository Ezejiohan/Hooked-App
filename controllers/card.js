const Cards = require('../models/card');
const Level = require('../models/level');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

// Controller to create a new card
const createCard = asyncWrapper(async(req, res, next) => {
     // Destructuring card details from request body
    const { cardName, cardDescription, question, answer } = req.body;
    // Getting levelId from request parameters
    const { levelId } = req.params;
    // Find the level by ID
    const level = await Level.findById(levelId);
    if (!level) {
        return next(createCustomError(`Level not found : ${levelId}`, 404));
    }
    // Create a new card associated with the specified level
    const cardData = await Cards.create({ level: levelId, cardName, cardDescription, question, answer});

    // Add the newly created card's ID to the level's cards array
    level.cards.push(cardData._id);

    // Save the card to the database
    await cardData.save();
    await level.save();
    // Respond with the created card data
    res.status(201).json({ cardData })
});

// Controller to get all cards
const getAllCards = asyncWrapper(async (req, res) => {
    // Fetch all cards from the database
    const cards = await Cards.find({});
    // Respond with the array of all cards
    res.status(200).json({ cards });
});

// Controller to get a specific card by its ID
const getCard =asyncWrapper(async (req, res, next) => {
    // Get cardId from request parameters
    const { cardId } = req.params;
    // Find the card by ID
    const card = await Cards.findById(cardId); 
    if (!card) {
        // If card not found, throw a 404 error
        return next(createCustomError(`Card not found: ${cardId}`, 404));
    }
    // Respond with the found card data
    res.status(200).json({ card });
})

module.exports = {
    createCard,
    getAllCards,
    getCard
}