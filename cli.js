#!/usr/bin/env node

var meow = require('meow');
var cli  = meow({help: "yep"});
var logger  = require('./lib/logger');

if (!module.parent) {
    handleCli(cli);
}

function handleCli(cli, opts) {
    opts = opts || {};
    opts.cb = opts.cb || function () {};

    try {
        var out = require('./lib/command.' + cli.input[0]);
        out(cli.flags)
            .then(function (out) {
                logger.info('{green:✔} URL: http://%s.vvlunch.co.uk', out.result.subdomain);
                logger.info('{green:✔} ID:  %s', out.result.basename);
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
                    //console.log(log.msg);
                }
            })
            .catch(function (err) {
                if (err.code && err.code === 'ECONNREFUSED') {
                    logger.error('Could not contact the release server. It may be offline.');
                } else {
                    if (typeof err.msg === 'string') {
                        logger.error(err.msg);
                    } else {
                        if (err.level && err.msg) {
                            logger.error(err.msg);
                        } else {
                            throw err;
                        }
                        //unknown error, log
                        //console.log(err);
                        //console.log(err.stack);
                    }
                }
            }).done();
        opts.cb(null, out);
    } catch (e) {
        if (e.code && e.code === 'MODULE_NOT_FOUND') {
            logger.error('The command {cyan:`%s`} does not exist', cli.input[0]);
        } else {
            console.error(e);
            console.log(e.stack);
        }
        console.log(e);
        opts.cb(e);
    }
}

module.exports = handleCli;