const BookModel = require('../models/bookModel')
const BookCategoryModel = require('../models/bookcategoryModel')
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { ErrorHandler } = require('../middlewares/errorMiddlewares')

const getAllBook = CatchAsyncErrors(async (req, res, next) => {
    const books = await BookModel.getAllBook();

    res.status(200).json({
        success: true,
        data: books
    });
});

const getBookById = CatchAsyncErrors(async (req, res, next) => {
    const book_id = req.params.id;
    const book = await BookModel.getBookById(book_id);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    res.status(200).json({
        success: true,
        data: book
    });
});

const getBook = CatchAsyncErrors(async (req, res, next) => {
    const book_id = req.params.id;
    const book = await BookModel.getBook(book_id);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    res.status(200).json({
        success: true,
        data: book
    });
});

const findBooks = CatchAsyncErrors(async (req, res, next) => {
    const { title, author, category } = req.query;
    const books = await BookModel.findBooks(title, author, category);
    if (books.length === 0) {
        return next(new ErrorHandler("No books found", 404));
    }
    res.status(200).json({
        success: true,
        data: books
    });
});

const createBook = CatchAsyncErrors(async (req, res, next) => {
    const { title, publisher_id, category_ids, publication_year, quantity, available, price, author } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const book = await BookModel.createBook(title, publisher_id, publication_year, quantity, available, price, author, image_url);

    for (let i = 0; i < category_ids.length; i++) {
     await BookCategoryModel.createBookCategory(book.book_id, category_ids[i]);
     }

    res.status(200).json({
        success: true,
        data: book,
    });
});


const updateBook = CatchAsyncErrors(async (req, res, next) => {
    const book_id = req.params.id;
    const {
        title,
        publisher_id,
        category_ids,
        publication_year,
        quantity,
        availability,
        price,
        author
    } = req.body;

    // Xử lý ảnh nếu có upload mới
    let image_url = null;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
        image_url = req.body.image_url;
    }

    const book = await BookModel.updateBook(
        book_id,
        title,
        publisher_id,
        publication_year,
        quantity,
        availability,
        price,
        author,
        image_url // truyền ảnh mới nếu có
    );

    if (!book) {
        return next(new ErrorHandler("Book Not Found", 404));
    }

    // Xóa category cũ, thêm mới
     const result = await BookCategoryModel.deleteBookCategory(book_id);
     for (let i = 0; i < category_ids.length; i++) {
         var temp = await BookCategoryModel.createBookCategory(book_id, category_ids[i]);
     }
    res.status(200).json({
        success: true,
        data: book
    });
});

const deleteBook = CatchAsyncErrors(async (req, res, next) => {
    const book_id = req.params.id;
    const book = await BookModel.deleteBook(book_id);
    const result = await BookCategoryModel.deleteBookCategory(book_id);

    if (!book) {
        return next(new ErrorHandler("Book Not Found", 404));
    }

    res.status(200).json({
        success: true,
        data: book
    });
});

module.exports = {
    getAllBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getBook,
    findBooks
}