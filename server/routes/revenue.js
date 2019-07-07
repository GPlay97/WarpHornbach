const express = require('express');
const router = express.Router();

const revenueController = require('../controllers/revenue');

router.get('/', revenueController.getRevenue);
router.post('/', revenueController.updateRevenue);

module.exports = router;