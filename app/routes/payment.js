var express = require('express');

var utils = require('../utils');
var payments = require('../lib/payments');

var router = express.Router();

/**
 * Render the home page.
 */
router.get(payments.route, function(req, res) {
    res.render('payment.jade');
});

module.exports = router;
