var fs = require('fs');
var logger = require('./logger');

module.exports = function (deferred, item) {

    var FormData = require('form-data');
    var form = new FormData();

    logger.debug('sending user {cyan:%s', item.config.get('user'));
    logger.debug('sending subdomain {cyan:%s', item.config.get('subdomain'));
    logger.debug('sending release {cyan:%s', item.config.get('filepath'));

    form.append('user', item.config.get('user'));
    form.append('flags', JSON.stringify(item.config.toJS()));
    form.append('subdomain', item.config.get('subdomain'));
    form.append('release', fs.createReadStream(item.config.get('filepath')));

    form.submit(item.config.get('dest'), function(err, res) {
        if (err) {
            return deferred.reject(err);
        }
        var chunks = [];
        res.on('data', function (data) {
            chunks.push(data);
        });
        res.on('end', function () {
            if (res.statusCode === 200) {
                if (chunks.length) {
                    var result = JSON.parse(chunks.join(''));
                    if (result.status === 'error') {
                        deferred.reject(result);
                    } else {
                        deferred.resolve(result);
                    }
                }
            } else {
                deferred.reject({level: 'error', msg: ['None 200 response'], res: res});
            }
        });
        res.resume(); // for node-0.10.x
    });
};