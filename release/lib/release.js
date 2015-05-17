var pack    = require("./pack");
var fs      = require("fs");
var path    = require("path");
var crypto  = require('crypto');
var conf  = require('./config');
var mkdirp  = require('mkdirp');
var logger  = require('./logger');
var rimraf  = require('rimraf');
var prettyBytes  = require('pretty-bytes');
var createSpinner = require('./spinner');

/**
 * @param deferred
 * @param item
 * @returns {*|promise}
 */
module.exports = function (deferred, item) {

    logger.debug('doing release with ', item.config.toJS());

    var spinner = createSpinner('Compressing...');
    spinner.start();

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

        spinner.stop(true);

        var shasum = crypto.createHash('sha1');
        var bytes  = archive.pointer();

        if (bytes > conf.get('maxSize')) {
            logger.info('That release is too big - did you include some files by mistake? (like the {yellow:node_modules} directory?)');
            logger.info('Use the {cyan:--input} flag to specify the correct directory');
            logger.info('Example: {green:crossbow publish --input dist}');
            deferred.reject({level: 'error', msg: ['Failed - Release too big']});
            return;
        }

        logger.info('Release size (compressed): {cyan:%s', prettyBytes(archive.pointer()));

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
