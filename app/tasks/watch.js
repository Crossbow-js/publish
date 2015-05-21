var bs          = require('browser-sync').create();
var sass        = require('./sass');
var paths       = require('./paths');
//var injector    = require('bs-html-injector');
var crossbow    = require('./crossbow');
var watchConfig = {ignoreInitial: true};
var builder     = require('./build');

/**
 * Register HTML injector with BrowserSync
 */
//bs.use(injector);

/**
 * Local Server from app root
 */
bs.init({
    server: {
        baseDir: [paths.public]
    },
    logFileChanges: false
});

/**
 * Watch and compile SASS tasks
 */
bs.watch('scss', watchConfig, function () {
    console.time('sass');
    sass()
        .then(function () {
            bs.reload(paths.sass.output);
            console.timeEnd('sass');
        })
        .catch(browserError)
        .done();
});

/**
 * Watch and compile SASS tasks
 */
bs.watch(['src', '*.json'], watchConfig, function () {
    console.time('site build');
    builder()
        .then(function () {
            console.timeEnd('site build');
            bs.reload();
            //bs.notify('<span style="color:magenta">HML injected</span>');
        })
        .catch(browserError)
        .done();
});

/**
 * Helper for console/browser Errors
 * @param err
 */
function browserError (err) {
    console.error(err);
    bs.notify(err.message);
}

/**
 * Also Export BrowserSync instance
 * @type {Object|*}
 */
module.exports = bs;