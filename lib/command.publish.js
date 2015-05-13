var release = require('./release');
var upload = require('./upload');
var assign = require('object-assign');
var logger = require('./logger');
var host = process.env.CBHOST || 'localhost';

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://"+host+"/upload",
    force: false,
    logLevel: 'info'
};

module.exports = function (flags) {

    var deferred = require('q').defer();


    var conf = assign({}, defaults, flags);

    if (!conf.user || !conf.subdomain) {
        deferred.reject(new Error('Must provide `user` and `subdomain`'));
    }

    logger.setLevel(conf.logLevel);

    /**
     * 1. Create a release by `tar` ing the public directory
     * 2. Upload the tar file
     * 3. Switch the symlink to point to the new release
     */
    release(conf)
        .then(upload(conf))
        .then(function (out) {
            deferred.resolve(out);
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
            deferred.reject(err);
            if (err.code && err.code === 'ECONNREFUSED') {
                logger.error('Could not contact the release server. It may be offline.');
            } else {
                if (typeof err.msg === 'string') {
                    logger.error(err.msg);
                } else {
                    //unknown error, log
                    console.log(err);
                    console.log(err.stack);
                }
            }
        });

    return deferred.promise;
};