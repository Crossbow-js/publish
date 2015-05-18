var fs     = require("fs");
var models = require("./models");
var db     = require("./db");

/**
 * Before unpacking, ensure the hash matches
 * @param deferred
 * @param item
 */
module.exports = function (deferred, item) {
    models.User.findOne({ email: item.fields.user }, 'firstName lastName email data subdomain', function(err, user) {
        if (user) {
            if (user.subdomain === item.fields.subdomain) {
                item.user = user;
                deferred.resolve(item);
            }
            deferred.reject({level: 'error', msg: 'Sorry, you have not registered that subdomain.'});
        } else {
            deferred.reject({level: 'error', msg: 'User not found'});
        }
    });
};