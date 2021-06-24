var express = require('express');
const { startCron, stopCron, getCurrencies } = require('../controller/currency');
var router = express.Router();

router.get('/cron/start', startCron);

router.get('/cron/stop', stopCron);

router.get('/find', getCurrencies)

module.exports = router;
