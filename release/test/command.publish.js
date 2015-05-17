var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var rimraf  = require('rimraf');
var fs      = require('fs');
var resolve = require('path').resolve;
var cmd     = require('../lib/command.publish');

var fixtureDir = resolve('test', 'fixtures');

describe('CLI publish', function () {
    beforeEach(function () {
        rimraf.sync('releases');
    });
    it('can return minimal data for success message', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'shane'
        })
        .then(function (resp) {
            assert.equal(resp.status, 'success');
            assert.equal(resp.result.subdomain, 'shane');
            app.close();
            done();
        }).done();
    });
});