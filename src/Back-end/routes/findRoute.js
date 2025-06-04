const express = require('express');
const { findBooks } = require('../controllers/findController');
const {  isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/search', findBooks);

module.exports = router;