const express = require("express");
const {getAllStudent,getStudentById,deleteStudent,updateStudent } = require("../controllers/studentController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getAllStudent);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;

