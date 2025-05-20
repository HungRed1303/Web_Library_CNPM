const express = require("express");
const {getAllAdmin,getAdminById,deleteAdmin,updateAdmin } = require("../controllers/adminController");

const router = express.Router();
router.get("/", getAllAdmin);
router.get("/:id", getAdminById);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
module.exports = router;