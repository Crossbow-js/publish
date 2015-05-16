var Immutable = require('immutable');

module.exports = Immutable.fromJS({
    output: process.env.CBDEST || require('path').resolve('sites'),
    publicDir: 'public',
    current: 'current',
    maxSize: Math.pow(20, 7)
});