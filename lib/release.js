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
    var datetime = new Date().getTime();

    var outputpath = path.join(
        item.config.get('cwd'),
        'releases',
        item.config.get('user'),
        item.config.get('subdomain'),
        datetime + '.tar.gz'
    );

    item.config = item.config.set('filepath', outputpath);

    mkdirp.sync(path.dirname(item.config.get('filepath')));

    var output = fs.createWriteStream(item.config.get('filepath'));

    output.on('close', function() {

        var shasum = crypto.createHash('sha1');

        var s = fs.ReadStream(item.config.get('filepath'));

        s.on('data', function(d) {
            shasum.update(d);
        });

        s.on('end', function() {
            var d = shasum.digest('hex');

            item.config = item.config.set('hash', d);

            deferred.resolve(item);
        });

    });

    output.on('error', function(err) {
        deferred.resolve(err);
    });

    var archive = pack(item);

    archive.pipe(output);
};
