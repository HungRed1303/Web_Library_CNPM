const LibrarianModel = require('../models/librarianModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErrorHandler} = require('../middlewares/errorMiddlewares');
const bcrypt = require('bcrypt');

const getAllLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const librarians = await LibrarianModel.getAllLibrarians();
    res.status(200).json(librarians);
});

const getLibrarianById = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const librarian = await LibrarianModel.getLibrarianById(id);
    if (!librarian) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    res.status(200).json(librarian);
});

const createLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const { username, email, name, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const librarian = await LibrarianModel.createLibrarian(
        username,
        email,
        name,
        hashedPassword
    );
    
    res.status(201).json(librarian);
});

const updateLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const { username, email, name } = req.body;
    
    const librarian = await LibrarianModel.updateLibrarian(
        id,
        username,
        email,
        name
    );
    
    if (!librarian) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    
    res.status(200).json(librarian);
});

const deleteLibrarian = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const result = await LibrarianModel.deleteLibrarian(id);
    
    if (!result) {
        return next(new ErrorHandler('Librarian not found', 404));
    }
    
    res.status(200).json({ message: 'Librarian deleted successfully' });
});

module.exports = {
    getAllLibrarian,
    getLibrarianById,
    createLibrarian,
    updateLibrarian,
    deleteLibrarian
};
