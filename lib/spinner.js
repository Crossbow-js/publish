var Spinner = require('cli-spinner').Spinner;
var logger = require('./logger');
var compile = require('./logger').compile;

module.exports = function (task) {
    var spinner = new Spinner(compile(logger.infoPrefix + task + ' {cyan:%s} '));
    spinner.setSpinnerString(Spinner.spinners[4]);
    return spinner;
};