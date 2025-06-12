const express = require("express")
const {getWishListByStudentId ,insertBookWishList,deleteBookWishList} =require("../controllers/wishlistController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.get("/:id",isAuthenticated,getWishListByStudentId);
router.post("/",isAuthenticated,insertBookWishList);
router.delete("/",isAuthenticated,deleteBookWishList);

module.exports = router;