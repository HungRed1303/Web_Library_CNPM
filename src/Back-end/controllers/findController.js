// controllers/findController.js
const BookModel = require('../models/bookModel');
const CatchAsyncErrors = require('../middlewares/catchAsyncErrors');
const {ErroHandler} = require("../middlewares/errorMiddlewares")


const findBooks = CatchAsyncErrors(async (req, res, next) => {
  const { title, author, category } = req.body;

  if (!title && !author && !category) {
    return next(new ErroHandler("Options are not selected",400));
  }

  const books = await BookModel.findBooks(title, author, category);

  res.status(200).json({
    success: true,
    data: books,
  });
});

module.exports = {
  findBooks,
};
