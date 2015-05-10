var through = require("through2");
var fs      = require("fs");
var path    = require("path");
var unpack  = require("./unpack");
var mkdirp  = require('mkdirp');
var rimraf  = require('rimraf');
var conf    = require('./config');
var Q       = require('q');

function processIncoming(args) {

    var deferred = Q.defer();
    var outpath = outputPath(args);

    /**
     * Check if the target output path exists
     */
    if (fs.existsSync(outpath)) {
        /**
         * Check if a user gave the --force command to override an existing release
         * This is mostly for debugging/development purposes
         */
        if (args.flags.force === false) {
            /**
             * If --force was not given, fail everything as this release already exists
             */
            deferred.reject({level: 'error', msg: 'That release already exists. Use {cyan:--force} to overwrite it.'});
            return deferred.promise;
        } else {
            /**
             * Brute-force remove the directory in preparation for new release
             */
            rimraf.sync(outpath);
        }
    }

    var _args = {
        input: path.resolve(args.file.path),
        output: path.resolve(outpath)
    };

    /**
     * At this point we can unpack the tarball
     */
    unpack(_args)
        .on('end', function () {
            /**
             * Resolve the promise with the minimum data needed in the
             * server response - eg: to give the user of the CLI
             * meaningful feedback such as the release ID, subdomain,
             * url etc etc
             */
            deferred.resolve({basename: args.basename, subdomain: args.subdomain});
        })
        .on('error', deferred.reject);

    return deferred.promise;
}

/**
 * Get the output path for releases
 * @param args
 */
function outputPath (args) {
    return path.join(conf.output, args.subdomain, args.basename)
}

/**
 * Accept the incoming data from the file upload
 * @param incoming
 * @returns {*}
 */
module.exports = function (incoming) {
    var file = incoming.files.release;
    return processIncoming({
        file: file,
        basename: path.basename(file.name, '.tar.gz'),
        subdomain: incoming.fields.subdomain,
        fields: incoming.fields,
        flags: incoming.flags
    })
};