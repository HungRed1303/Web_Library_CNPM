const express = require("express");
const { register, login,forGotPassword,resetPassword} = require("../controllers/authController");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});
router.post('/password/forgot',forGotPassword);
router.put('/password/reset/:token', resetPassword);

module.exports = router;
