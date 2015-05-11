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
    it('can create correct symlinks for a release', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent'
        })
        .then(function (output) {
            assert.isTrue(fs.existsSync(output.symlinks.target));
            assert.isTrue(fs.existsSync(output.symlinks.target));
            app.close();
            done();
        });
    });
    it('can upack the folder correctly', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent'
        })
        .then(function (output) {
            var expected = fs.readFileSync('test/fixtures/public/index.html', 'utf-8');
            var actual   = fs.readFileSync(output.symlinks.src + '/index.html', 'utf-8');
            assert.deepEqual(expected, actual);
            app.close();
            done();
        });
    });
    it('can create symlinks correctly', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent'
        })
        .then(function (output) {
            var symlink  = fs.readlinkSync(output.symlinks.target);
            var expectdSymlink = output.symlinks.src.split('/').slice(-2).join('/'); // last 2 segs
            assert.equal(expectdSymlink, symlink);
            app.close();
            done();
        });
    });
});