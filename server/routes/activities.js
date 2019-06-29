const express = require('express');
const router = express.Router();

const activitiesController = require('../controllers/activities');

router.post('/', activitiesController.postActivity);
router.get('/', activitiesController.getActivities);

module.exports = router;