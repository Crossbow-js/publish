var assert  = require('chai').assert;
var server  = require('../server');
var http    = require('http');
var rimraf  = require('rimraf');
var fs      = require('fs');
var path    = require('path');
var resolve = require('path').resolve;
var cmd     = require('../lib/command.publish');
var models  = require('../lib/models');
var mongoose = require('mongoose');
var exec    = require('child_process').exec;

var fixtureDir = resolve('test', 'fixtures');

function getPaths (resp) {
    return {
        release: path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename),
        target:  path.join(process.env.CBDEST, resp.result.subdomain, resp.result.basename, 'public'),
        symlink: path.join(process.env.CBDEST, resp.result.subdomain, 'current')
    }
}

var dockerUrl  = require('url').parse(process.env.DOCKER_HOST);
mongoose.connect('mongodb://' + dockerUrl.hostname + ':4001');

describe('Creating a release with auth', function () {
    it('can create correct symlinks for a release', function (done) {
        models.User.findOne({ email: 'shakyshane@gmail.com' }, 'firstName lastName email data', function(err, user) {
            console.log(err);
            console.log(user);
            done();
        });
    });
});