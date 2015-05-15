var fs      = require("fs");
var path    = require("path");
var unpack  = require("./unpack");
var rimraf  = require('rimraf');
var conf    = require('./config');
var logger  = require('./logger');

/**
 * Before unpacking, ensure the hash matches
 * @param deferred
 * @param item
 */
module.exports = function (deferred, item) {

    var outpath  = outputPath(item);
    var existing = getExistingRelease(item, outpath);

    /**
     * Check if the target output path exists
     */
    if (existing.length) {
        /**
         * Check if a user gave the --force command to override an existing release
         * This is mostly for debugging/development purposes
         */
        if (item.flags.force === false) {
            /**
             * If --force was not given, fail everything as this release already exists
             */
            deferred.reject({level: 'error', msg: 'That release already exists. Use {cyan:--force} to overwrite it.'});
            return deferred.promise;
        } else {
            /**
             * Brute-force remove the directory in preparation for new release
             * continue afterwards to forge the new release
             */
            rimraf.sync(existing[0]);
        }
    }

    var _args = {
        input: item.file.path,
        output: path.resolve(outpath, 'public')
    };

    logger.debug('unpacking release with input: {cyan:%s', _args.input);
    logger.debug('unpacking release with output: {cyan:%s', _args.output);

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
            deferred.resolve({basename: item.basename, subdomain: item.subdomain, args: item});
        })
        .on('error', deferred.reject);
};

/**
 * Get the output path for releases
 * @param args
 */
function outputPath (args) {
    return path.join(conf.get('output'), args.subdomain, args.basename);
}

/**
 * Look in this subdomain for any previous releases
 * an existing release is one that has the same content hash.
 * Example, the following are the same content
 * eg1: 634563465-rgwergwerg
 * eg2: 73erf3465-rgwergwerg
 * @param args
 * @param outpath
 * @returns {*}
 */
function getExistingRelease (args, outpath) {

    /**
     * Get a list of all directories
     */
    var exists = fs.existsSync(path.join(conf.get('output'), args.subdomain));
    var dirs   = [];
    var match  = [];

    if (exists) {
        dirs = fs.readdirSync(path.join(conf.get('output'), args.subdomain));
    }

    /**
     * Loop through, looking for ones that match the regex
     */
    if (dirs.length) {
        match = dirs.filter(function (item) {
            return item.match(new RegExp("([\\d])+-" + args.hashslice));
        });

        /**
         * Return the first match as an array
         */
        if (match.length) {
            return [outputPath({subdomain: args.fields.subdomain, basename: match[0]})];
        }
    }

    /**
     * If no matches found, return an empty array
     */
    return match;
}