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
    var outpath  = outputPath(args);
    var existing = getExistingRelease(args, outpath);

    /**
     * Check if the target output path exists
     */
    if (existing.length) {
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
             * continue afterwards to forge the new release
             */
            rimraf.sync(existing[0]);
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

function releaseDir (args) {
    return args.timestamp + '-' + args.hashslice;
}

function getExistingRelease (args, outpath) {

    //console.log(args.hashslice);
    //console.log(args.timestamp);
    //console.log(args.basename);
    //console.log(args.fields.user);
    //console.log(args.fields.subdomain);

    var dirs = fs.readdirSync(path.join(conf.output, args.subdomain));
    var match = [];

    if (dirs.length) {
        match = dirs.filter(function (item) {
            return item.match(new RegExp("([\\d])+-" + args.hashslice));
        });

        return [outputPath({subdomain: args.fields.subdomain, basename: match[0]})];
    }

    return match;

}
/**
 * Accept the incoming data from the file upload
 * @param incoming
 * @returns {*}
 */
module.exports = function (incoming) {
    var file = incoming.files.release;
    var hashslice = path.basename(file.name, '.tar.gz').slice(0, 10);
    var timestamp = String(new Date().getTime());
    var basename = releaseDir({hashslice: hashslice, timestamp: timestamp});
    return processIncoming({
        file: file,
        basename: basename,
        hashslice: hashslice,
        timestamp: timestamp,
        subdomain: incoming.fields.subdomain,
        fields: incoming.fields,
        flags: incoming.flags
    })
};