const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entry.controller');
const recommendationController = require('../controllers/recommendation.controller');
// middleware to check auth if needed
// const auth = require('../middleware/auth'); 

router.post('/entry', entryController.trackEntry);
router.post('/exit', entryController.trackExit);
router.get('/', recommendationController.getRecommendations);

module.exports = router; 
