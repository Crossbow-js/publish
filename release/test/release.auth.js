var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var rimraf  = require('rimraf');
var fs      = require('fs');
var path    = require('path');
var resolve = require('path').resolve;
var cmd     = require('../lib/command.publish');
var models  = require('../lib/models');
var exec    = require('child_process').exec;
var db      = require('../lib/db');

var fixtureDir = resolve('test', 'fixtures');

function getPaths (resp) {
    return {
        release: path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename),
        target:  path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename, 'public'),
        symlink: path.join(process.env.CBDEST, resp.result.subdomain, 'current')
    }
}

describe('Creating a release with auth', function () {
    it('can reject a non-user', function (done) {

        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'non-user@gmail.com',
            subdomain: 'shane'
        })
        .catch(function (err) {
            assert.equal(err.status, 'error');
            assert.include(err.msg,    'User not found');
            done();
        }).done();
    });
    it('can reject a valid user, with invalid subdomain', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'kittens'
        })
        .catch(function (err) {
            assert.equal(err.status, 'error');
            assert.equal(err.msg,    'Sorry, you have not registered that subdomain.');
            done();
        }).done();
    });
});