const express = require("express")
const { deleteLibraryCard,requestLibraryCard,extendLibraryCard,acceptLibraryCard}= require("../controllers/librarycardController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.post("/request/:id",isAuthenticated,requestLibraryCard)
router.put("/accept/:id",isAuthenticated,isAuthorized("A","L"),acceptLibraryCard)
router.put("/extend/:id",isAuthenticated,isAuthorized("A","L"),extendLibraryCard)
router.delete("/delete/:id",isAuthenticated,isAuthorized("A","L"),deleteLibraryCard)

module.exports = router;