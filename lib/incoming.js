var fs      = require("fs");
var path    = require("path");
var conf    = require('./config');
var logger  = require('./logger');
var prom  = require('prom-seq');
logger.setLevel('debug');
var Q       = require('q');

/**
 * Accept the incoming data from the file upload
 * @param incoming - from HTTP server
 * @returns {*}
 */
module.exports = function (incoming) {

    var file     = incoming.files.release;
    var basename = path.basename(file.name, '.tar.gz');

    var tasks = [
        /**
         * Verify the incoming tar ball
         */
        require('./verify.incoming'),

        /**
         * Process the incoming tar ball
         */
        require('./process.incoming'),

        /**
         * Swap symlinks for release
         */
        require('./swap-symlink')

    ];

    return prom(tasks, {
        file:      file,
        basename:  basename,
        subdomain: incoming.fields.subdomain,
        fields:    incoming.fields,
        flags:     incoming.flags
    }).then(function (output) {
        /**
         * Output returned to CLI
         */
        return {
            basename: output.basename,
            subdomain: output.subdomain
        };
    }).catch(function (err) {
        console.log(err);
    })
};