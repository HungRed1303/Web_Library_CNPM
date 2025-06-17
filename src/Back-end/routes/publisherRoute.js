const express = require("express");
const {getAllPublisher,createPublisher,getPublisherById,deletePublisher,updatePublisher } = require("../controllers/publisherController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");


const router = express.Router();
router.get("/", isAuthenticated,isAuthorized("A","L"),getAllPublisher);
router.get("/:id", isAuthenticated,isAuthorized("A","L"),getPublisherById);
router.post("/", isAuthenticated,isAuthorized("A","L"),createPublisher);
router.put("/:id",isAuthenticated,isAuthorized("A","L"), updatePublisher);
router.delete("/:id",isAuthenticated,isAuthorized("A","L"),deletePublisher);
module.exports = router;
