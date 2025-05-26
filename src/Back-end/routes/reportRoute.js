const express = require("express")
const{ viewReport} = require("../controllers/reportController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router()

router.get("/",viewReport)

module.exports = router