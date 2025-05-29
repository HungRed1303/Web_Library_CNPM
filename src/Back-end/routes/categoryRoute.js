const express = require("express")
const {getAllCategory,getCategoryById, createCategory, updateCategory, deleteCategory} = require("../controllers/categoryController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",getAllCategory);
router.get("/:id",getCategoryById);
router.post("/",createCategory);
router.put("/:id", updateCategory);
router.delete("/:id",deleteCategory);

module.exports = router;