var express = require('express');
const { startCron, stopCron } = require('../controller/currency');
var router = express.Router();

router.get('/cron/start', startCron);

router.get('/cron/stop', stopCron);

module.exports = router;
