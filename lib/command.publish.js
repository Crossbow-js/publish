var assign = require('object-assign');
var logger = require('./logger');
var host = process.env.CBHOST || 'localhost';
var prom = require('prom-seq');
var Immutable = require('immutable');

var defaults = {
    input: 'public',
    cwd: process.cwd(),
    dest: "http://"+host+"/upload",
    force: false,
    logLevel: 'info'
};

module.exports = function (flags) {

    var conf = assign({}, defaults, flags);

    var item = {
        config: Immutable.fromJS(conf)
    };

    logger.setLevel(conf.logLevel);

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