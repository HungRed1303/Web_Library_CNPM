const express = require("express")
const{ viewReport, getTotalTypeOfBook, getTotalIssuedBook,getTotalStudent,getTotalBook, getNumberBookByGenre,getTopReader,  getIssueReturnBookWeek} = require("../controllers/reportController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router()

router.get("/",isAuthenticated, isAuthorized("A","L"),viewReport)
router.get("/type-of-book",isAuthenticated, isAuthorized("A","L"),getTotalTypeOfBook);
router.get("/issue-book",isAuthenticated, isAuthorized("A","L"), getTotalIssuedBook)
router.get("/student",isAuthenticated, isAuthorized("A","L"), getTotalStudent)
router.get("/book",isAuthenticated, isAuthorized("A","L"), getTotalBook)
router.get("/book-by-genre",isAuthenticated, isAuthorized("A","L"), getNumberBookByGenre)
router.get("/top-reader",isAuthenticated, isAuthorized("A","L"), getTopReader)
router.get("/issue-return-book",isAuthenticated, isAuthorized("A","L"),   getIssueReturnBookWeek)

module.exports = router