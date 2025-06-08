const express = require("express")
const { deleteLibraryCard,requestLibraryCard,extendLibraryCard,acceptLibraryCard}= require("../controllers/librarycardController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.post("/request/:id",requestLibraryCard)
router.put("/accept/:id",acceptLibraryCard)
router.put("/extend/:id",extendLibraryCard)
router.delete("/delete/:id",deleteLibraryCard)

module.exports = router;