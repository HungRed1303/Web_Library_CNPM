const express = require("express")
const { deleteLibraryCard,requestLibraryCard,extendLibraryCard,approveLibraryCard, getAllLibraryCards, getLibraryCardByStudentId}= require("../controllers/librarycardController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.get("/", isAuthenticated,isAuthorized("A","L"), getAllLibraryCards);
router.get("/:id", isAuthenticated,isAuthorized("A","L"), getLibraryCardByStudentId);
router.post("/request/:id",requestLibraryCard)
router.put("/approve/:id",isAuthenticated,isAuthorized("A","L"),approveLibraryCard)
router.put("/extend/:id",isAuthenticated,isAuthorized("A","L"),extendLibraryCard)
router.delete("/delete/:id",isAuthenticated,isAuthorized("A","L"),deleteLibraryCard)

module.exports = router;