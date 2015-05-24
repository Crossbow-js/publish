var mongoose = require('mongoose');
var db = require('../lib/db');

var Account   = require('../models').Account;
var User   = require('../models').User;
var acctypes = require('../accounts').accounts;

var items = Object.keys(acctypes).map(function (key) {
    return acctypes[key];
});

Account.create(items, function (err, out) {
    if (err) {
        console.log(err);
        console.log(err.stack);
        process.exit(1);
    } else {
        console.log('Database populated with accounts', items);
        process.exit(0);
    }
});
