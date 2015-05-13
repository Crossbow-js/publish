var release = require('./release');
var upload = require('./upload');
var swapSymlink = require('./swap-symlink');
var assign = require('object-assign');
var logger = require('./logger');
var host = process.env.CBHOST || 'localhost';

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://"+host+"/upload",
    user: 'shakyshane@gmail.com',
    subdomain: 'shane',
    force: false,
    logLevel: 'info'
};

module.exports = function (flags) {

    var deferred = require('q').defer();

    var conf = assign({}, defaults, flags);

    logger.setLevel(conf.logLevel);

    logger.debug('aw');

    /**
     * 1. Create a release by `tar` ing the public directory
     * 2. Upload the tar file
     * 3. Switch the symlink to point to the new release
     */
    release(conf)
        .then(upload(conf))
        .then(function (out) {
            deferred.resolve(out);
            //logger.info('{green:√} - Release ');
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
                }
            }
        });

    return deferred.promise;
};