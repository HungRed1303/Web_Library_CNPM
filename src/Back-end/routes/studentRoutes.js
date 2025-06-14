const express = require("express");
const {getAllStudent,getStudentById,deleteStudent,updateStudent } = require("../controllers/studentController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

// router.get("/",isAuthenticated, isAuthorized("A","L"), getAllStudent);
// router.get("/:id",isAuthenticated, isAuthorized("A","L"), getStudentById);
// router.put("/:id", isAuthenticated, isAuthorized("A","L"),updateStudent);
// router.delete("/:id",isAuthenticated, isAuthorized("A","L"), deleteStudent);

router.get("/", getAllStudent);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;

