const express = require("express");
const {getAllLibrarian,getLibrarianById,deleteLibrarian,updateLibrarian } = require("../controllers/librarianController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",isAuthenticated,isAuthorized("A"), getAllLibrarian);
router.get("/:id",isAuthenticated,isAuthorized("A", "L"), getLibrarianById);
router.put("/:id",isAuthenticated,isAuthorized("A"), updateLibrarian);
router.delete("/:id",isAuthenticated,isAuthorized("A"), deleteLibrarian);

module.exports = router;