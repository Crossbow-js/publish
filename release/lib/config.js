var Immutable = require('immutable');

module.exports = Immutable.fromJS({
    output: process.env.CBDEST || require('path').resolve('sites'),
    publicDir: 'public',
    host: process.env.CBHOST || 'localhost',
    current: 'current',
    maxSize: Math.pow(20, 7)
});