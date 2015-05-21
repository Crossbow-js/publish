var crossbow = require('./crossbow');
var sass     = require('./sass');
var icons    = require('./icons');
var prom     = require('prom-seq');
var paths    = require('./paths');
var vfs      = require('vinyl-fs');
var rimraf   = require('rimraf');

const LOG_LEVEL = 'info';

/**
 * Clean the dist folder
 * @param deferred
 */
function cleanDir (deferred) {
    rimraf.sync(paths.public);
    deferred.resolve();
}

/**
 * Copy the font from the src directory
 * @param deferred
 */
function copyFont (deferred) {
    vfs.src(paths.font.input)
        .pipe(vfs.dest(paths.font.output))
        .on('end', deferred.resolve)
        .on('error', deferred.reject);
}

/**
 * Copy the font from the src directory
 * @param deferred
 */
function copySvg (deferred) {
    vfs.src(paths.svg.input)
        .pipe(vfs.dest(paths.svg.output))
        .on('end', deferred.resolve)
        .on('error', deferred.reject);
}

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var builder = prom.create([
    cleanDir,
    copyFont,
    copySvg,
    icons.tasks,
    crossbow.tasks,
    sass.tasks
]);

/**
 * Export the promise sequence
 * @type {Object|*}
 */
module.exports = builder;

/**
 * Handle CLI input
 */
if (!module.parent) {

    console.time('Site Build');
    builder()
        .progress(function (obj) {
            if (obj.level === LOG_LEVEL) {
                console.log(obj.msg);
            }
        })
        .then(function () {
            console.timeEnd('Site Build');
        })
        .catch(function (e) {
            console.log(e.stack);
        });
}