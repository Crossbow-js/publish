var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var rimraf  = require('rimraf');
var fs      = require('fs');
var request = require('supertest');
var resolve = require('path').resolve;
var cmd     = require('../lib/command.publish');

var fixtureDir = resolve('test', 'fixtures');

describe('Running the Server', function () {
    beforeEach(function () {
        rimraf.sync('releases');
    });
    it('can handle incorrect requests', function (done) {
        var app = http.createServer(server);
        request(app)
            .get('/')
            .end(function (err, res) {
                assert.equal(res.statusCode, 401);
                assert.include(res.text, 'Cannot access this');
                done();
            });
    });
    it('can issue the publish command when server offline', function (done) {
        cmd({
            cwd: fixtureDir,
            logLevel: 'silent'
        }).catch(function (err) {
            done();
        });
    });
    it('can return 401 when incorrect endpoint hit', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port,
            logLevel: 'silent'
        }).catch(function (out) {
            assert.equal(out.res.statusCode, 401);
            app.close();
            done();
        });
    });
});