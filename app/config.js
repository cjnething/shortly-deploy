var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortlydb');

var db = mongoose.connection;
module.exports = db;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('mongo open');
});
