var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

var urlSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

urlSchema.pre('save', function(next){
 var shasum = crypto.createHash('sha1');
 shasum.update(this.url);
 this.code =  shasum.digest('hex').slice(0, 5);
 next();
});

module.exports = mongoose.model('Link', urlSchema);
