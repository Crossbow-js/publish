var release = require('./release');
var upload = require('./upload');
var assign = require('object-assign');
var logger = require('./logger');
var host = process.env.CBHOST || 'localhost';
var prom = require('prom-seq');
var Immutable = require('immutable');

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://"+host+"/upload",
    force: false,
    logLevel: 'info'
};

module.exports = function (flags) {

    var conf = assign({}, defaults, flags);

    //if (!conf.user || !conf.subdomain) {
    //    deferred.reject(new Error('Must provide `user` and `subdomain`'));
    //}

    var model = {
        config: Immutable.fromJS(conf)
    };

    logger.setLevel(conf.logLevel);

    var tasks = [release, upload];

    return prom(tasks, model).then(function (out) {
        console.log(out);
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
            console.log(err);
            console.log(err.stack);
            //deferred.reject(err);
            if (err.code && err.code === 'ECONNREFUSED') {
                logger.error('Could not contact the release server. It may be offline.');
            } else {
                if (typeof err.msg === 'string') {
                    logger.error(err.msg);
                } else {
                    //unknown error, log
                    //console.log(err);
                    //console.log(err.stack);
                }
            }
        });
};