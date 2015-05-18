var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var dockerUrl  = require('url').parse(process.env.DOCKER_HOST);
mongoose.connect('mongodb://' + dockerUrl.hostname + ':4001');

var bcrypt = require('bcryptjs');
var User   = require('../lib/models').User;
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('123456', salt);

var user = new User({
    firstName:  'shane',
    lastName:   'osbourne',
    email:      'shakyshane@gmail.com',
    password:   hash,
    subdomain:  'shane'
});

user.save(function(err) {
    if (err) {
        var error = 'Something bad happened! Please try again.';

        if (err.code === 11000) {
            error = 'That email is already taken, please try another.';
        }
        console.log(error);
        process.exit(1);
    } else {
        console.log("User stub created with", user);
        process.exit(0);
    }
});
