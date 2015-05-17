var archiver = require('archiver');
var path     = require("path");

/**
 * @returns {*}
 * @param item
 */
module.exports = function (item) {

    var config = {
        gzip:        true,
        gzipOptions: {
            level: 1
        }
    };

    var archive = archiver('tar', config);

    archive.bulk([{
        expand: true,
        cwd:    item.config.get('inputDir'),
        src:    ['**/*']
    }]);

    archive.finalize();

    return archive;
};