var pack    = require("./pack");
var through = require("through2");
var fs      = require("fs");
var path    = require("path");
var crypto  = require('crypto');
var mkdirp  = require('mkdirp');
var rimraf  = require('rimraf');
var Q       = require('q');

module.exports = function (flags) {

    var deferred = Q.defer();

    rimraf.sync(path.join(flags.cwd, 'releases'));

    var shasum = crypto.createHash('sha1');
    var hex;

    pack(flags)
        .pipe(through.obj(function (file, type, cb) {
            shasum.update(file);
            file.path = flags.input + '.tar.gz';
            this.push(file);
            cb();
        }, function (cb) {
            var stream = this;
            hex = shasum.digest('hex');
            stream.hex = hex;
            cb();
        }))
        .on('finish', function () {
            var stream = this;
            writeFile(stream).on('finish', function () {
                deferred.notify({level: 'info', msg: 'Release created!'});
                deferred.resolve(stream);
            });
        })
        .on('error', deferred.reject);

    function writeFile (stream) {
        var outpath = path.join(flags.cwd, 'releases', stream.hex + '.tar.gz');
        mkdirp.sync(path.dirname(outpath));
        stream.filepath = outpath;
        return stream
            .pipe(fs.createWriteStream(outpath));
    }

    return deferred.promise;
};
