// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = require("./models/index");
var User = require("./models/user");

//create express app object
var app = express();

//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
  res.render("index");
});


app.get('/signup', function (req, res) {
   // req.currentUser(function (err, user) {
   //  // redirect if current user
   //  if (user) {
   //    res.redirect('index');
   //  } else {
      res.render('signup');
    // }
  // });
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


app.listen(process.env.PORT || 3000);

