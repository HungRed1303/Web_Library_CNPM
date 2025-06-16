const express = require("express")
const { viewBorrowingHistoryById} = require("../controllers/borrowinghistoryController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:id",isAuthenticated,viewBorrowingHistoryById);

module.exports = router;