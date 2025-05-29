const express = require("express");
const { register, login,logout,forGotPassword,resetPassword} = require("../controllers/authController");
const {isAuthenticated} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/password/forgot', forGotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout', isAuthenticated, logout);

module.exports = router;
