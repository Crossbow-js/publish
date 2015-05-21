var sass     = require('node-sass');
var paths    = require('./paths');
var CleanCSS = require('clean-css');
var prom     = require('prom-seq');

/**
 * Define the tasks that make up a build
 * @type {Object}
 */
var tasks    = [processSass, autoprefix, minifyCss, writeFile];
var builder  = prom.create(tasks);

/**
 * Process SASS
 * @param deferred
 * @param previous
 */
function processSass (deferred, previous) {
    var out = sass.renderSync({
        file: paths.make('sass', 'input')
    });
    deferred.resolve(out.css);
}

/**
 * Add prefixes automatically
 * @param deferred
 * @param previous
 */
function autoprefix (deferred, previous) {
    var postcss = require('postcss');
    postcss([require('autoprefixer')])
        .process(previous)
        .then(function (result) {
            deferred.resolve(result.css);
        }).catch(deferred.reject);
}

/**
 * Minify CSS output
 * @param deferred
 * @param previous
 */
function minifyCss (deferred, previous) {

    var minified = new CleanCSS({
        relativeTo: __dirname
    }).minify(previous.toString()).styles;

    deferred.resolve(minified);
}

/**
 * @param deferred
 * @param previous
 */
function writeFile (deferred, previous) {
    try {
        paths.write('sass', 'output', previous);
        deferred.notify({level: 'debug', msg: 'CSS File written to ' + paths.make('sass', 'output')});
        deferred.resolve(previous);
    } catch (e) {
        deferred.reject(e);
    }
}

if (!module.parent) {
    builder()
        .progress(function (obj) {
            console.log(obj.msg);
        })
        .catch(function (err) {
            console.error(err);
        });
}

module.exports = builder;
module.exports.tasks = tasks;