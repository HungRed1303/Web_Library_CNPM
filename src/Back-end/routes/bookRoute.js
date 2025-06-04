const express = require('express')
const {getAllBook,getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllBook);
router.get("/:id", getBookById);
router.post("/",isAuthenticated,isAuthorized("A","L"),createBook);
router.put("/:id",isAuthenticated,isAuthorized("A","L"),updateBook);
router.delete("/:id",isAuthenticated,isAuthorized("A","L"),deleteBook);

module.exports =  router;
