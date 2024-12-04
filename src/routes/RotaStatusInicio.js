const express = require('express');
const { getStats } = require('../controllers/StatusController');
const router = express.Router();

router.get('/', getStats);

module.exports = router;