var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
//var Post = require("./post"); editted, dawg

// create a user Schema
var userSchema = new Schema({
	// create a blueprint for our user object
	username: String,
	passwordDigest: String,
  //posts: [Post.schema] editted, dawg
});

  // create a new user with secure (hashed) password
userSchema.statics.createSecure = function(username, password, callback){
    // `this` references our schema
    // store it in variable `user` because `this` changes context in nested callbacks

    var user = this;

    // hash password user enters at sign up
    bcrypt.genSalt(function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        console.log(hash);

        // create the new user (save to db) with hashed password
        user.create({
          username: username,
          passwordDigest: hash
        }, callback);
      });
    });
  };

  // authenticate user (when user logs in)
  userSchema.statics.authenticate = function (username, password, callback) {
    // find user by username entered at log in
    this.findOne({username: username}, function (err, user) {
      console.log(user);

      // throw error if can't find user
      if (!user) {
        console.log('No user with username ' + username);

      // if found user, check if password is correct
      } else if (user.checkPassword(password)) {
        callback(null, user);
      } 
      // else {
      //   callback("Error: incorrect password",null);
      // }
    });
  };

// compare password user enters with hashed password (`passwordDigest`)
userSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
  return bcrypt.compareSync(password, this.passwordDigest);
};


  var User = mongoose.model('User', userSchema);

// After creating a new model, require and export it:
module.exports = User;
