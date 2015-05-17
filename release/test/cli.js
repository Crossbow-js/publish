//var assert  = require('chai').assert;
//var server  = require('../server');
//var http    = require('http');
//var rimraf  = require('rimraf');
//var fs      = require('fs');
//var resolve = require('path').resolve;
//var cli     = require('../cli');
//
//var fixtureDir = resolve('test', 'fixtures');
//
//describe('CLI commands', function () {
//    beforeEach(function () {
//        //rimraf.sync('releases');
//    });
//    it.skip('gives a nice error if command not supported', function (done) {
//        cli({input: ['aqwdwe']}, {cb: function (e) {
//            assert.equal(e.message, 'Cannot find module \'./lib/command.aqwdwe\'');
//            done();
//        }});
//    });
//});