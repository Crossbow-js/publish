var formidable = require('formidable');
var http       = require('http');
var util       = require('util');
var incoming   = require('./lib/incoming');

http.createServer(function(req, res) {

    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if (files.release) {

                incoming({files: files, fields: fields})

                    .then(function (output) {
                        res.writeHead(200, {'content-type': 'application/json'});
                        res.end(JSON.stringify({status: 'success', fields: fields, output: output}));
                    })

                    .catch(function (err) {
                        res.writeHead(200, {'content-type': 'application/json'});
                        res.end(JSON.stringify({status: 'error', message: err.message}));
                    })
            }

        });

        return;
    }

    res.writeHead(401, {'content-type': 'text/plain'});
    res.end('Cannot access this');

}).listen(8080);