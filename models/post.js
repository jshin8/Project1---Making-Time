// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define post schema
var PostSchema = new Schema({
  name: String,
  message: String,
  dadate: String
});

// create and export Log model
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;