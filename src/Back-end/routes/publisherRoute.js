const express = require("express");
const {getAllPublisher,createPublisher,getPublisherById,deletePublisher,updatePublisher } = require("../controllers/publisherController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");


const router = express.Router();
router.get("/", getAllPublisher);
router.get("/:id", getPublisherById);
router.post("/", isAuthorized("A","L"),createPublisher);
router.put("/:id",isAuthorized("A","L"), updatePublisher);
router.delete("/:id",isAuthorized("A","L"),deletePublisher);
module.exports = router;
