var fs = require('fs');
var archiver = require('archiver');
var tar = require("tar");
var fstream = require("fstream");
var path = require("path");
var zlib = require("zlib");
var through = require("through2");

function onError(err) {
    console.error('An error occurred:', err)
    console.log(err.stack);
}

function onEnd() {
    //console.log('Packed!')
}

/**
 * @returns {*}
 * @param item
 */
module.exports = function (item) {


    var archive = archiver('tar',
        {
            gzip: true,
            gzipOptions: {
                level: 1
            }
        });

    //archive.pipe(output);

    archive.bulk([
        { expand: true, cwd: path.resolve(item.config.get('cwd'), item.config.get('input')), src: ['*.html'] }
    ]);

    archive.finalize();

    return archive;
};