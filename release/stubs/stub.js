var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var dockerUrl  = require('url').parse(process.env.DOCKER_HOST);
mongoose.connect('mongodb://' + dockerUrl.hostname + ':4001');

var bcrypt = require('bcryptjs');

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
var User = mongoose.model('User', new Schema({
    id:           ObjectId,
    firstName:    { type: String, required: '{PATH} is required.' },
    lastName:     { type: String, required: '{PATH} is required.' },
    email:        { type: String, required: '{PATH} is required.', unique: true },
    password:     { type: String, required: '{PATH} is required.' },
    data:         Object
}));

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('123456', salt);

var user = new User({
    firstName:  'shane',
    lastName:   'osbourne',
    email:      'shakyshane@gmail.com',
    password:   hash
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
        console.log("USER STUB CREATED");
        process.exit(0);
    }
});
