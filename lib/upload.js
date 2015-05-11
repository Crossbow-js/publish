var Q  = require('q');
var fs = require('fs');

module.exports = function (flags) {

    return function (stream) {

        var deferred = Q.defer();

        var FormData = require('form-data');
        var form = new FormData();

        form.append('user', flags.user);
        form.append('flags', JSON.stringify(flags));
        form.append('subdomain', flags.subdomain);
        form.append('release', fs.createReadStream(stream.filepath));
        form.submit(flags.dest, function(err, res) {
            if (err) {
                return deferred.reject(err);
            }
            var chunks = [];
            res.on('data', function (data) {
                chunks.push(data);
            });
            res.on('end', function () {
                if (res.statusCode === 200) {
                    var result = JSON.parse(chunks.join(''));
                    if (result.status === 'error') {
                        deferred.reject(result);
                    } else {
                        deferred.resolve(result);
                    }
                } else {
                    deferred.reject({level: 'error', msg: ['None 200 response'], res: res});
                }
            });
            res.resume(); // for node-0.10.x
        });

        return deferred.promise;
    }
};