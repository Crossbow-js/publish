var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var rimraf  = require('rimraf');
var fs      = require('fs');
var path    = require('path');
var resolve = require('path').resolve;
var cmd     = require('../lib/command.publish');

var fixtureDir = resolve('test', 'fixtures');

function getPaths (resp) {
    return {
        release: path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename),
        target:  path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename, 'public'),
        symlink: path.join(process.env.CBDEST, resp.result.subdomain, 'current')
    }
}

describe('Creating a release', function () {
    beforeEach(function () {
        rimraf.sync('releases');
    });
    it.only('can create correct symlinks for a release', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'shane'
        })
        .then(function (resp) {
            var paths = getPaths(resp);
                console.log(paths);
            assert.isTrue(fs.existsSync(paths.symlink));
            assert.isTrue(fs.existsSync(paths.release));
            assert.isTrue(fs.existsSync(paths.target));
            app.close();
            done();
        }).done();
    });
    it('can upack the folder correctly', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'shane'
        })
        .then(function (resp) {
            var paths = getPaths(resp);
            var expected = fs.readFileSync('test/fixtures/public/index.html', 'utf-8');
            var actual   = fs.readFileSync(paths.target + '/index.html', 'utf-8');
            assert.deepEqual(expected, actual);
            app.close();
            done();
        }).done();
    });
    it('can create symlinks correctly', function (done) {
        var app = http.createServer(server).listen();
        cmd({
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'shane'
        })
        .then(function (resp) {
            var paths = getPaths(resp);
            var symlink  = fs.readlinkSync(paths.symlink);
            var expectdSymlink = paths.target.split('/').slice(-2).join('/'); // last 2 segs
            assert.equal(expectdSymlink, symlink);
            app.close();
            done();
        }).done();
    });
    it('can swap the symlinks following a second deploy', function (done) {
        var app = http.createServer(server).listen();
        var config = {
            cwd: fixtureDir,
            dest: "http://localhost:" + app.address().port + '/upload',
            logLevel: 'silent',
            user: 'shakyshane@gmail.com',
            subdomain: 'shane'
        };

        cmd(config)
            .then(function (resp) {

            var filepath = 'test/fixtures/public/index.html';
            var defaultContent = fs.readFileSync(filepath, 'utf-8');
            var dummyContent = 'Some dummy content';

            fs.writeFileSync(filepath, dummyContent);

            cmd(config)
                .then(function (resp) {

                    var paths = getPaths(resp);
                    var actual = fs.readFileSync(paths.target + '/index.html', 'utf-8');

                    assert.equal(dummyContent, actual);

                    // restore the state of the fixture file
                    fs.writeFileSync(filepath, defaultContent);

                    app.close();
                    done();
                }).done();
        }).done();
    });
});