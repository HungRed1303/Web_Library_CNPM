const express = require("express")
const { viewBorroingHistoryById} = require("../controllers/borrowinghistoryController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:id",viewBorrowingHistoryById);

module.exports = router;