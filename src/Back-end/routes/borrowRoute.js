const express = require("express")
const {getAllBookIssue,  getAllBookRequest,getBookIssueById,getBookRequestById,deleteBookIssue,deleteBookRequest,borrowBook, issueBook, returnBook} = require("../controllers/borrowController");
const {isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");
const router = express.Router();

// API thêm để xuất request và issue ra màn hình
router.get("/get-book-request",getAllBookRequest)
router.get("/get-book-request/:id",getBookRequestById)
router.get("/get-book-issue",getAllBookIssue)
router.get("/get-book-issue/:id",getBookIssueById)
router.delete("/delete-book-request/:id",deleteBookRequest)
router.delete("/delete-book-issue/:id",deleteBookIssue)

// API để mượn sách
router.post("/borrow-book",borrowBook)
router.put("/issue-book/:id",issueBook)
router.put("/return-book/:id",returnBook)

module.exports = router;