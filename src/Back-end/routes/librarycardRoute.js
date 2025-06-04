const express = require("express")
const { deleteLibraryCard,requestLibraryCard,extendLibraryCard,acceptLibraryCard}= require("../controllers/librarycardController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.post("/request",requestLibraryCard)
router.put("/accept",acceptLibraryCard)
router.put("/extend",extendLibraryCard)
router.delete("/delete",deleteLibraryCard)

module.exports = router;