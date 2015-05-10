var tar = require("tar");
var fstream = require("fstream");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");
var through = require("through2");

function onError(err) {
    console.error('An error occurred:', err)
}

function onEnd() {
    //console.log('Packed!')
}

var packer = tar.Pack({noProprietary: true})
    .on('error', onError)
    .on('end', onEnd);

/**
 * @param {{cwd: string, input: string}} flags
 * @returns {*}
 */
module.exports = function (flags) {
    return fstream.Reader({path: path.resolve(flags.cwd, flags.input), type: "Directory"})
        .on('error', onError)
        .pipe(packer)
        .pipe(zlib.createGzip());
};