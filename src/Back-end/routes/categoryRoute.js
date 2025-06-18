const express = require("express")
const {getAllCategory,getCategoryById, createCategory, updateCategory, deleteCategory} = require("../controllers/categoryController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",getAllCategory);
router.get("/:id",getCategoryById);
router.post("/",isAuthenticated,isAuthorized("A","L"),createCategory);
router.put("/:id", isAuthenticated,isAuthorized("A","L"),updateCategory);
router.delete("/:id",isAuthenticated,isAuthorized("A","L"),deleteCategory);

module.exports = router;