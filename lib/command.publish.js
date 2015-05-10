var release = require('./release');
var upload = require('./upload');
var swapSymlink = require('./swap-symlink');
var fs = require('fs');

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://localhost:8080/upload",
    user: 'shakyshane@gmail.com',
    subdomain: 'shane'
};

module.exports = function (flags) {

    release(defaults)
        .then(upload(defaults))
        .then(swapSymlink(defaults))
        .then(function (out) {
            console.log(out);
        })
        .progress(function (log) {
            if (log.level === 'info') {
                //console.log('Crossbow progress:', log.msg);
            }
            if (log.level === 'error') {
                console.error('Crossbow [ERROR]:', log.msg);
            }
        })
        .catch(function (err) {
            console.error('Crossbow release Error');
            console.error(err.message);
        });
};