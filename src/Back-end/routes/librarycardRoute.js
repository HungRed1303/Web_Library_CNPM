const express = require("express")
const { deleteLibraryCard,requestLibraryCard,extendLibraryCard,approveLibraryCard, getAllLibraryCards}= require("../controllers/librarycardController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.get("/", isAuthenticated, getAllLibraryCards);
router.post("/request/:id",isAuthenticated,requestLibraryCard)
router.put("/approve/:id",isAuthenticated,isAuthorized("A","L"),approveLibraryCard)
router.put("/extend/:id",isAuthenticated,isAuthorized("A","L"),extendLibraryCard)
router.delete("/delete/:id",isAuthenticated,isAuthorized("A","L"),deleteLibraryCard)

module.exports = router;