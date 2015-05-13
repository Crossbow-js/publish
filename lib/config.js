module.exports = {
    output: process.env.CBDEST || require('path').resolve('sites'),
    publicDir: 'public',
    current: 'current'
};