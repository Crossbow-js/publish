var tar = require("tar");
var zlib = require("zlib");
var fs = require("fs");


function onError(err) {
    console.error('An error occurred:', err)
}

function onEnd() {
    //console.log('Extracted!')
}


module.exports = function (args) {

    var extractor = tar.Extract({path: args.output})
        .on('error', onError)
        .on('end', onEnd);

    return fs.createReadStream(args.input)
        .on('error', onError)
        .pipe(zlib.createGunzip())
        .pipe(extractor)
};