var mongoose = require('mongoose');
var host = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
var port = process.env.MONGO_PORT_27017_TCP_PORT || '27017';

mongoose.connect('mongodb://' + host + ':' + port);