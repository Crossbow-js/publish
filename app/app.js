var utils = require('./utils');

utils.createApp().listen(8080);

console.log('running at port 8080');

//Object.keys(process.env).forEach(function (key) {
//    console.log(key, process.env[key]);
//})
