const express = require("express");
const {getAllAdmin,getAdminById,deleteAdmin,updateAdmin } = require("../controllers/adminController");
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/",isAuthenticated,isAuthorized("A"), getAllAdmin);
router.get("/:id",isAuthenticated,isAuthorized("A"), getAdminById);
router.put("/:id",isAuthenticated,isAuthorized("A"), updateAdmin);
router.delete("/:id",isAuthenticated,isAuthorized("A"), deleteAdmin);
module.exports = router;