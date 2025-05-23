const LibrarianModel = require('../models/librarianModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');

const getAllLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const librarians = await LibrarianModel.getAllLibrarians();
    res.status(200).json({
        success: true,
        data: librarians
    });
});

const getLibrarianById = CatchAsyncErrors(async (req, res, next) => {
    const librarian_id = req.params.id;
    const librarian = await LibrarianModel.getLibrarianById(librarian_id);
    if (!librarian) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    res.status(200).json({
        success: true,
        data: librarian
    });
});

const updateLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const librarian_id = req.params.id;
    const { username, email, name, start_date, end_date } = req.body;
    const librarian = await LibrarianModel.updateLibrarian(librarian_id, username, email, name, start_date, end_date);
    if (!librarian) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    res.status(200).json({
        success: true,
        data: librarian
    });
});

const deleteLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const librarian_id = req.params.id;
    const librarian = await LibrarianModel.deleteLibrarian(librarian_id);
    if (!librarian) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    res.status(200).json({
        success: true,
        data: librarian
    });
});

module.exports = {
    getAllLibrarian,
    getLibrarianById,
    updateLibrarian,
    deleteLibrarian
};
