const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
