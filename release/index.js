var http = require("http");

var server = http.createServer(require('./server.js'));

server.listen(8080);