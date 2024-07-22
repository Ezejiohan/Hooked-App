const Level = require('../models/level');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createLevel = asyncWrapper( async (req, res) => {
    const {beginner} = req.body;
    const beginnerData = await Level.create({ beginner });
    res.status(201).json({ beginnerData }); 
    
    const {intermediate} = req.body;
    const intermediateData = await Level.create({ intermediate });
    res.status(201).json({ intermediateData });

    const {experts} = req.body;
    const expertsData = await Level.create({ experts });
    res.status(201).json({ expertsData });
});

const getAll

module.exports = {
    createLevel
}