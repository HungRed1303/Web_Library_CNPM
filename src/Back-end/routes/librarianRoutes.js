const express = require("express");
const {getAllLibrarian,getLibrarianById,deleteLibrarian,updateLibrarian } = require("../controllers/librarianController");
const router = express.Router();

router.get("/", getAllLibrarian);
router.get("/:id", getLibrarianById);
router.put("/:id", updateLibrarian);
router.delete("/:id", deleteLibrarian);

module.exports = router;