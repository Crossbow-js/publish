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
        cwd:    path.resolve(item.config.get('cwd'), item.config.get('input')),
        src:    ['**/*']
    }]);

    archive.finalize();

    return archive;
};