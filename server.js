var formidable = require('formidable');
var http       = require('http');
var util       = require('util');
var incoming   = require('./lib/incoming');

http.createServer(server).listen(8080);

function handleUpload (req, res) {
    return function (err, fields, files) {
        /**
         * Ensure the request had a file upload called `release`
         */
        if (files.release) {

            /**
             * Process the incoming file upload
             */
            incoming({
                files: files,
                fields: fields,
                flags: JSON.parse(fields.flags)
            })
            /**
             * Handle a successful response
             */
            .then(function (output) {
                /**
                 * Send a JSON response
                 */
                res.writeHead(200, {'content-type': 'application/json'});
                /**
                 * Set the status to 'success' and also pass
                 * along any output (this is typically info about the upload)
                 */
                res.end(JSON.stringify({status: 'success', fields: fields, output: output}));
            })
            /**
             * Catch any errors that occured in the file upload
             * These could be server errors, auth errors, release errors etc
             */
            .catch(function (err) {
                res.writeHead(200, {'content-type': 'application/json'});
                res.end(JSON.stringify({status: 'error', msg: err.msg}));
            })
        }
    }
}

/**
 * Simple HTTP server accepting file uploads
 * @param req
 * @param res
 */
function server (req, res) {
    /**
     * If the url is /upload and method=POST,
     * process the upload.
     */
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.parse(req, handleUpload(req, res));
        return;
    }
    /**
     * For all other requests, end with a 401 response
     */
    res.writeHead(401, {'content-type': 'text/plain'});
    res.end('Cannot access this');
}