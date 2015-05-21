var paths = require('./paths');
var vfs = require('vinyl-fs');
var path = require('path');
var symbols = require('easy-svg');
var prom = require('prom-seq');

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var tasks = [makeSymbols];
var builder = prom.create(tasks);

/**
 * Process SASS
 * @param deferred
 * @param previous
 */
function makeSymbols(deferred, previous) {

    vfs.src(paths.icons.input)
        .pipe(symbols.stream())
        .on('error', deferred.reject)
        .pipe(vfs.dest(paths.icons.output))
        .on('end', deferred.resolve);
}

if (!module.parent) {
    builder()
        .progress(function (obj) {
            console.log(obj.msg);
        })
        .catch(function (err) {
            console.log('eR');
            console.log(err.stack);
        });
}

module.exports = builder;
module.exports.tasks = tasks;

