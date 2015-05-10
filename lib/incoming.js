var through = require("through2");
var fs      = require("fs");
var path    = require("path");
var unpack  = require("./unpack");
var mkdirp  = require('mkdirp');
var rimraf  = require('rimraf');
var conf    = require('./config');
var Q       = require('q');

rimraf.sync('sites');

function processIncoming(args) {

    var deferred = Q.defer();

    if (fs.existsSync(outputPath(args))) {
        deferred.reject(new Error('That release already exists'));
        return deferred.promise;
    }

    var _args = {
        input: args.file.path,
        output: outputPath(args)
    };

    var input = path.resolve(_args.input);
    var output = path.resolve(_args.output);

    unpack({input: input, output: output})
        .on('end', function () {
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

module.exports = function (incoming) {
    var file = incoming.files.release;
    return processIncoming({
        file: file,
        basename: path.basename(file.name, '.tar.gz'),
        subdomain: incoming.fields.subdomain
    })
};

//unpack(args)
//    .on('end', function () {
//        console.log('aw yeah');
//    });