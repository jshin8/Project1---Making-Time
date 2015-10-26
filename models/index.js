//connect to mongodb

var mongoose = require("mongoose");
var User = require("./user");

mongoose.connect( process.env.MONGOLAB_URI ||
                  process.env.MONGOHQ_URL || 
                  "mongodb://localhost/express_heroku_starter" );

//mongoose.connect("mongodb://localhost/my_heroku_app");
// After creating a new model, require and export it:
// module.exports.Tweet = require("./tweet.js");


// After creating a new model, require and export it:
module.exports.User = User;