var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Account = mongoose.model('Account', new Schema({
  id:           ObjectId,
  name:         {type: String, required: '{PATH} is required.'},
  price:        {type: Number, required: '{PATH} is required.'}
}));

var User = mongoose.model('User', new Schema({
  id:           ObjectId,
  firstName:    {type: String, required: '{PATH} is required.'},
  subdomain:    {type: String, required: '{PATH} is required.', unique: true},
  lastName:     {type: String, required: '{PATH} is required.'},
  email:        {type: String, required: '{PATH} is required.', unique: true},
  password:     {type: String, required: '{PATH} is required.'},
  account:      [{type: Schema.Types.ObjectId, ref: 'Account'}],
  data:         Object
}));

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
module.exports.User     = User;
module.exports.Account  = Account;