var mongoose = require('mongoose');

var dockerUrl  = require('url').parse(process.env.DOCKER_HOST);
mongoose.connect('mongodb://' + dockerUrl.hostname + ':4001');