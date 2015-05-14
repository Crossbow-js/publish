var tar = require("tar");
var fstream = require("fstream");
var fs = require("fs");
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
 * @param {{cwd: string, input: string}} flags
 * @returns {*}
 */
module.exports = function (item) {
    var packer = tar.Pack({noProprietary: true})
        .on('error', onError)
        .on('end', onEnd);

    return fstream.Reader({path: path.resolve(item.config.get('cwd'), item.config.get('input')), type: "Directory"})
        .on('error', onError)
        .pipe(packer)
        .pipe(zlib.createGzip());
};