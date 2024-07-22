const Level = require('../models/level');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('../errors/custom_error');

const createLevel = asyncWrapper( async (req, res) => {
    const { levelname } = req.body;
    const levelData = await Level.create({ levelname });
    res.status(201).json({ levelData });
});

const getAllLevels = asyncWrapper(async (req, res) => {
    const level = await Level.find({});
    res.status(200).json({ level });
});

const getLevel = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const level = await Level.findById(id)
    if (!id) {
        return next(createCustomError(`id not found : ${id}`, 404))
    }
    res.status(200).json({level})
});

module.exports = {
    createLevel,
    getAllLevels,
    getLevel
}