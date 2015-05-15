var fs      = require("fs");

/**
 * Before unpacking, ensure the hash matches
 * @param deferred
 * @param item
 */
module.exports = function (deferred, item) {

    var shasum = require('crypto').createHash('sha1');

    var s = fs.ReadStream(item.file.path);

    s.on('data', function (d) {
        shasum.update(d);
    });

    s.on('end', function () {
        var d = shasum.digest('hex');
        if (d === item.fields.hash) {
            deferred.resolve(item);
        } else {
            deferred.reject(item);
        }
    });
};