const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

router.post('/:username/login', usersController.login);
router.post('/:username', usersController.register);

module.exports = router;