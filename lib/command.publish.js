var assign = require('object-assign');
var logger = require('./logger');
var host = process.env.CBHOST || 'localhost';
var prom = require('prom-seq');
var resolve = require('path').resolve;
var Immutable = require('immutable');

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://"+host+"/upload",
    force: false,
    logLevel: 'info'
};

module.exports = function (flags) {

    // todo verify incoming args
    var conf = assign({}, defaults, flags);

    /**
     * Set the input DIR property - mostly for logging
     */
    conf.inputDir = resolve(conf.cwd, conf.input);

    var item = {
        config: Immutable.fromJS(conf)
    };

    /**
     * Set log level for CLI user
     */
    logger.setLevel(item.config.get('logLevel'));

    /**
     * Log which DIR is to be used
     */
    logger.info('Creating a release from:   {cyan:%s', item.config.get('inputDir'));

    /**
     * List of tasks to be completed in sequence
     * @type {*[]}
     */
    var tasks = [

        /**
         * Create a Tar ball of the publish directory
         */
        require('./release'),
        /**
         * Upload the tar ball to the server
         * todo - auth here with email + token based auth
         */
        require('./upload')
    ];

    return prom(tasks, item);
};