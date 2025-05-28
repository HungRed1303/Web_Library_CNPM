const express = require("express")
const { viewBorroingHistoryById} = require("../controllers/borrowinghistoryController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",viewBorroingHistoryById);

module.exports = router;