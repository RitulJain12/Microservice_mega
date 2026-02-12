const express = require('express');
const recommendController = require('../controllers/recommendation.controller');

const router = express.Router();

router.post("/entry", recommendController.entryTime);
router.post("/exit", recommendController.exitTime);
router.get("/premium-discounts", recommendController.getPremiumRecommendations);
router.get("/", (req, res) => { res.send("op") });

module.exports = router;