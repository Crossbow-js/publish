var Q = require('q');
var fs = require('fs');
var path = require('path');
var conf = require('./config');

module.exports = function (flags) {
    return function (args) {

        var deferred = Q.defer();

        var src = path.resolve(conf.output, args.output.subdomain, args.output.basename, 'public');
        var target = path.resolve(conf.output, args.output.subdomain, 'current');

        args.symlinks = {
            src: src,
            target: target
        };

        if (fs.existsSync(target)) {
            fs.unlinkSync(target);
        }

        fs.symlink(args.symlinks.src, args.symlinks.target, function (err) {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(args);
            }
        });

        return deferred.promise;
    }
};

