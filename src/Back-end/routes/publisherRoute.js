const express = require("express");
const {getAllPublisher,createPublisher,getPublisherById,deletePublisher,updatePublisher } = require("../controllers/publisherController");

const router = express.Router();
router.get("/", getAllPublisher);
router.get("/:id", getPublisherById);
router.post("/", createPublisher);
router.put("/:id", updatePublisher);
router.delete("/:id", deletePublisher);
module.exports = router;
