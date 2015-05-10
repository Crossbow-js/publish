var release = require('./release');
var upload = require('./upload');
var swapSymlink = require('./swap-symlink');
var fs = require('fs');
var assign = require('object-assign');
var logger = require('./logger');

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://localhost:8080/upload",
    user: 'shakyshane@gmail.com',
    subdomain: 'shane',
    force: false
};

module.exports = function (flags) {

    var conf = assign({}, defaults, flags);



    release(conf)
        .then(upload(conf))
        .then(swapSymlink(conf))
        .then(function (out) {
            console.log(out.output);
        })
        .progress(function (log) {
            var fn = logger[log.level];
            if (typeof fn === 'function') {
                if (Array.isArray(log.msg)) {
                    fn.apply(null, log.msg);
                } else {
                    fn(log.msg);
                }
            } else {
                console.log(log.msg);
            }
        })
        .catch(function (err) {
            if (err.code && err.code === 'ECONNREFUSED') {
                logger.error('Could not contact the release server. It may be offline.');
            } else {
                if (typeof err.msg === 'string') {
                    logger.error(err.msg);
                }
            }
        });
};