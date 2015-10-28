// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = require("./models/index");
var User = require("./models/user");
var session = require('express-session');

//create express app object
var app = express();

//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//middleware for cookies
app.use(session({
 saveUninitialized: true,
 resave: true,
 secret: 'SuperSecretCookie',
 cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
  // console.log("works");
  // req.currentUser(function (err, user) {
  //   // show profile if logged-in user
  //   console.log("yes");
  //   if (user) {
  //     res.render('profile');           
  //   // redirect if no user logged in
  //   } else {
      res.render('profile');
  //   }
  // });
});

app.get('/', function(req, res) {
  res.render("index");
});


app.get('/signup', function (req, res) {
    req.currentUser(function (err, user) {
   //  // redirect if current user
     if (user) {
       res.render('index');
     } else {
      res.render('signup');
     }
   });
});

//user submits the signup form
app.post('/users', function (req, res) {
  // grab user data from params (req.body)
  var newUser = req.body.user;
  // create new user with secure password
  User.createSecure(newUser.username, newUser.password, function (err, user) {
  	//req.session.userId = newUser._id;
    res.redirect('/login');
  });
});


// login route (renders login view)
app.get('/login', function (req, res) {
  res.render('login');
});

// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.username, userData.password, function (err, user) {
    //req.login(user);
    //redirect to user profile
    res.redirect('/profile');
  });
});




app.listen(process.env.PORT || 3000);

