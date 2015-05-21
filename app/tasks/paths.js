var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Define your paths here
 * @type {object}
 */
var paths = {
    sass: {
        input:  'scss/main.scss',
        output: 'public/css/main.min.css'
    },
    hbs: {
        input:   'src',
        output:  'public'
    },
    font: {
        input: 'font/**',
        output: 'public/font'
    },
    svg: {
        input: 'svg/svg4everybody.js',
        output: 'public/svg'
    },
    icons: {
        input: 'svg/icons/*.svg',
        output: 'public/svg'
    },
    public: 'public'
};

/**
 * @param key
 * @param type
 * @param output
 */
function write (key, type, output) {
    var outpath = make(key, type);
    mkdirp.sync(path.dirname(outpath));
    fs.writeFileSync(outpath, output);
}

/**
 * @param key
 * @param type
 * @returns {String|*}
 */
function make (key, type) {
    return path.resolve(__dirname, '../', paths[key][type]);
}

module.exports       = paths;
module.exports.make  = make;
module.exports.write = write;
module.exports.root  = process.cwd();