var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var request = require('supertest');
var resolve = require('path').resolve;

describe('Running the Server', function () {
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
    it('can issue the publish command', function (done) {
        var cmd = require('../lib/command.publish');
        cmd({
            cwd: resolve('test', 'fixtures')
        }).then(function (output) {
            console.log(output);
            done();
        }).done();
    });
});