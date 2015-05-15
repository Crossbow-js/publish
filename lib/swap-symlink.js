var path = require('path');
var conf = require('./config');
var cp = require('child_process');

module.exports = function (deferred, item) {

    /**
     * Create the ln -sfn <options> command
     * I couldn't get fs.symlink to work reliably.
     */
    var symlinkcmd = symlinkCmd({basename: item.basename});

    /**
     * Options for the exec command
     * @type {{cwd}}
     */
    var opts = {
        cwd: path.resolve(conf.get('output'), item.subdomain)
    };

    /**
     * Execute the symlink command
     */
    cp.exec(symlinkcmd, opts, function (error, stdout, stderr) {
        if (error !== null) {
            deferred.reject(error);
            return;
        }
        deferred.resolve(item);
    });
};

/**
 * Create the symlink command.
 * NOTE: paths are relative as we give CWD in the exec options
 * NOTE: switches -s -f -n are needed to correctly overwrite existing symlinks
 * EG: `ln -sfn 4tg24524g45g45g345g3/public current`
 * @param opts
 * @returns {string}
 */
function symlinkCmd (opts) {
    return ['ln -fns', opts.basename + '/' + conf.get('publicDir'), conf.get('current')].join(' ');
}
