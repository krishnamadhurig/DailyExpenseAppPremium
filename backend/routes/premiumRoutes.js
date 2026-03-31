// routes/premiumRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { buyPremium } = require('../controllers/premiumController');

// POST /api/premium/buy
router.post('/buy', authMiddleware, buyPremium);

module.exports = router;