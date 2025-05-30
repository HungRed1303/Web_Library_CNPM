const PublisherModel = require('../models/publisherModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');

const getAllPublisher = CatchAsyncErrors(async (req, res, next) => {
    const publishers = await PublisherModel.getAllPublishers();
    res.status(200).json({
        success: true,
        data: publishers
    });
});

const getPublisherById = CatchAsyncErrors(async (req, res, next) => {
    const publisher_id = req.params.id;
    const publisher = await PublisherModel.getPublisherById(publisher_id);
    if (!publisher) {
        return next(new ErrorHandler('Publisher not found', 404));
    }
    res.status(200).json({
        success: true,
        data: publisher
    });
});

const createPublisher = CatchAsyncErrors(async (req, res, next) => {
    const { name, address, email, phone_number } = req.body;
    const publisher = await PublisherModel.createPublisher(name, address, email, phone_number);
    res.status(201).json({
        success: true,
        data: publisher
    });
});

const updatePublisher = CatchAsyncErrors(async (req, res, next) => {
    const publisher_id = req.params.id;
    const { name, address, email, phone_number } = req.body;
    const publisher = await PublisherModel.updatePublisher(name, address, email, phone_number, publisher_id);
    if (!publisher) {
        return next(new ErrorHandler('Publisher not found', 404));
    }
    res.status(200).json({
        success: true,
        data: publisher
    });
});

const deletePublisher = CatchAsyncErrors(async (req, res, next) => {
    const publisher_id = req.params.id;
    const publisher = await PublisherModel.deletePublisher(publisher_id);
    if (!publisher) {
        return next(new ErrorHandler('Publisher not found', 404));
    }
    res.status(200).json({
        success: true,
        data: publisher
    });
});

module.exports = {
    getAllPublisher,
    getPublisherById,
    createPublisher,
    updatePublisher,
    deletePublisher
};

