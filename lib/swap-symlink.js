var Q = require('q');
var fs = require('fs');
var path = require('path');
var conf = require('./config');
var cp = require('child_process');

module.exports = function (flags) {

    return function (args) {

        var deferred = Q.defer();

        /**
         * Save absolute paths to the symlinks
         * @type {{src, target}}
         */
        args.symlinks = {
            src: path.resolve(conf.output, args.output.subdomain, args.output.basename, conf.publicDir),
            target: path.resolve(conf.output, args.output.subdomain, conf.current)
        };

        /**
         * Create the ln -sfn <options> command
         * I couldn't get fs.symlink to work reliably.
         */
        var symlinkcmd = symlinkCmd({basename: args.output.basename});

        /**
         * Options for the exec command
         * @type {{cwd}}
         */
        var opts = {
            cwd: path.resolve(conf.output, args.output.subdomain)
        };

        /**
         * Execute the symlink command
         */
        cp.exec(symlinkcmd, opts, function (error, stdout, stderr) {
            if (error !== null) {
                deferred.reject(error);
                return;
            }
            deferred.resolve(args);
        });

        return deferred.promise;
    }
};

/**
 * Create the symlink command.
 * NOTE: paths are relative as we give CWD in the exec options
 * NOTE: switches -s -f -n are needed to correctly overwrite existing symlinks
 * EG: `ln -sfn 4tg24524g45g45g345g3/public current`
 * @param opts
 * @returns {string}
 */
function symlinkCmd (opts) {
    return ['ln -sfn', opts.basename + '/' + conf.publicDir, conf.current].join(' ');
}
