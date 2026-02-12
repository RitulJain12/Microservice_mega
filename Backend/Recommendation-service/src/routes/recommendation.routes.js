const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entry.controller');
const recommendationController = require('../controllers/recommendation.controller');

router.post('/entry', entryController.trackEntry);
router.post('/exit', entryController.trackExit);
router.get('/', recommendationController.getRecommendations);

module.exports = router; 
