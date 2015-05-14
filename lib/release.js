var pack    = require("./pack");
var through = require("through2");
var fs      = require("fs");
var path    = require("path");
var crypto  = require('crypto');
var mkdirp  = require('mkdirp');
var logger  = require('./logger');
var rimraf  = require('rimraf');

/**
 * @param deferred
 * @param item
 * @returns {*|promise}
 */
module.exports = function (deferred, item) {

    logger.debug('doing release with ', item.config.toJS());

    /**
     * Wipe any current release directory
     * todo: use temp folder for this
     */
    rimraf.sync(path.join(item.config.get('cwd'), 'releases'));

    /**
     * Use a sha1 hash of the tarball's content to create
     * a release ID
     * todo: find a more reliable way of versioning because this
     * can produce false negatives if for example the file modified
     * date changes.
     */
    var shasum  = crypto.createHash('sha1');
    var hex;

    /**
     * Create a tarball from a directory
     * flags should contain at least a `cwd` and `input` property
     * see ./pack.js
     */
    pack(item)
        .pipe(through.obj(function (file, type, cb) {

            shasum.update(file);

            /**
             * Update the file in stream to have a path property
             */
            file.path = item.config.get('input') + '.tar.gz';
            this.push(file);
            cb();

        }, function (cb) {
            var stream = this;

            /**
             * Digest the content to create the hash
             * and save to the stream property .hash
             */
            stream.hash = shasum.digest('hex');

            logger.debug('tar file processed with hash {cyan:%s', stream.hash);

            cb();
        }))
        .on('finish', function () {
            var stream = this;

            /**
             * Write the tarball to disk
             * resolve the promise when finished
             */
            writeFile(stream)
                .on('finish', function () {
                    deferred.notify({level: 'info', msg: ['Release created from {yellow:./%s', item.config.get('input')]});
                    item.stream = stream;
                    deferred.resolve(item);
                })
                .on('error', deferred.reject);
        })
        .on('error', deferred.reject);

    function writeFile (stream) {

        /**
         * Create the output path based on the cwd +
         * releases + hash + ext
         */
        stream.filepath = path.join(item.config.get('cwd'), 'releases', stream.hash + '.tar.gz');

        /**
         * Ensure the directory exists so that
         * fs.createWriteStream does not fail
         */
        mkdirp.sync(path.dirname(stream.filepath));

        /**
         * Pipe the stream into fs.createWriteStream to write
         * the file to disk.
         * Return the stream so that others can listen to it's end/finish/error events.
         */
        return stream
            .pipe(fs.createWriteStream(stream.filepath));
    }
};
