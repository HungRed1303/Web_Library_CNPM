const express = require("express")
const {getAllBookIssue,  getAllBookRequest,getBookIssueById,getBookRequestById,deleteBookIssue,deleteBookRequest,borrowBook, issueBook, returnBook, rejectBookRequest} = require("../controllers/borrowController");
const {isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");
const router = express.Router();

// API thêm để xuất request và issue ra màn hình
router.get("/get-book-request",isAuthenticated,isAuthorized("A","L"),getAllBookRequest)
router.get("/get-book-request/:id",isAuthenticated,isAuthorized("A","L"),getBookRequestById)
router.get("/get-book-issue",isAuthenticated,isAuthorized("A","L"),getAllBookIssue)
router.get("/get-book-issue/:id",isAuthenticated,isAuthorized("A","L"),getBookIssueById)
router.delete("/delete-book-request/:id",isAuthenticated,isAuthorized("A","L"),deleteBookRequest)
router.delete("/delete-book-issue/:id",isAuthenticated,isAuthorized("A","L"),deleteBookIssue)

// API để mượn sách
router.post("/borrow-book",isAuthenticated,borrowBook)
router.put("/issue-book/:id",isAuthenticated,isAuthorized("A","L"),issueBook)
router.put("/reject-book-request/:id",isAuthenticated,isAuthorized("A","L"),rejectBookRequest)
router.put("/return-book/:id",isAuthenticated,isAuthorized("A","L"),returnBook)

module.exports = router;