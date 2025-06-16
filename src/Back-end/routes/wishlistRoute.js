const express = require("express")
const {getWishListByStudentId ,insertBookWishList,deleteBookWishList} =require("../controllers/wishlistController")
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

router = express.Router();

router.get("/:id",getWishListByStudentId);
router.post("/",insertBookWishList);
router.delete("/",deleteBookWishList);

module.exports = router;