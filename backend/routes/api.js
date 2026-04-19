const express = require('express');
const router = express.Router();
const crowdController = require('../controllers/crowdController');

router.get('/crowd-data', crowdController.getCrowdData);
router.post('/save-check', crowdController.saveCheck);
router.get('/history', crowdController.getHistory);

module.exports = router;
