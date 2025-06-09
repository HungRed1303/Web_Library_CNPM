const express = require('express');
const {
  getAllBook,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

// Get all books and a single book
router.get("/", getAllBook);
router.get("/:id", getBookById);

// Create and update book with image upload
// router.post("/", isAuthenticated, isAuthorized("A", "L"), upload.single('image'), createBook);
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);

// Delete book
router.delete("/:id", deleteBook);

module.exports = router;
