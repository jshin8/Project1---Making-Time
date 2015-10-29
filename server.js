// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var	_ = require('underscore');
var db = require("./models/index");
var User = require("./models/user");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Post = require('./models/post');

//create express app object
var app = express();

//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
// must use cookieParser before session
// configure app to use cookieParser
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//middleware for cookies
app.use(session({
 saveUninitialized: true,
 resave: true,
 secret: 'SuperSecretCookie',
 cookie: { maxAge: 600000 }
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

//get static index
app.get('/', function (req, res) {
  res.render("index");
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
   req.currentUser(function (err, user) {
  // show profile if logged-in user
     if (user) {
       res.render('profile');           
  //   // redirect if no user logged in
     } else {
      res.render('index');
     }
   });
});

// signup route
app.get('/signup', function (req, res) {
    req.currentUser(function (err, user) {
   //  // redirect if current user
     if (user) {
       res.redirect('profile');
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
  req.currentUser(function (err, user) {
   //  // redirect if current user
     if (user) {
       res.redirect('profile');
     } else {
      res.render('login');
     }
   });
});

// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.username, userData.password, function (err, user) {
    req.login(user);
    //redirect to user profile
    res.redirect('/profile');
  });
});



// API ROUTES

// show current user
app.get('/api/users/current', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    res.json(user);
  });
});

// create new post for current user
app.post('/api/users/current/posts', function (req, res) {
  // create new log with form data (`req.body`)
  var newPost = new Post({
    name: req.body.name,
    message: req.body.message
  });

  // save new post
  newPost.save();

  // find current user
  req.currentUser(function (err, user) {
    // embed new post in user's posts
    user.posts.push(newPost);
    // save user (and new post)
    user.save();
    // respond with new post
    res.json(newPost);
  });
});

// show all posts
app.get('/api/posts', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts);
  });
});

// create new post
app.post('/api/posts', function (req, res) {
  // create new post with form data (`req.body`)
  var newPost = new Post({
    name: req.body.name,
    message: req.body.message
  });

  // save new post
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});





app.listen(process.env.PORT || 3000);

