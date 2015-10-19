var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/users');
var userCollection = db.get('users');
var studentCollection= db.get('students');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  var username = req.session.username;
  studentCollection.find({}, function (err, data) {
    res.render('home', { username: username, allStudents: data });
  });
});

router.get('/signout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});


router.post('/register', function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, 12);
  var errors = [];
  if(req.body.email.length == 0) {
    errors.push('Email cannot be blank');
  }
  if (!req.body.email.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")){
     errors.push("Email is not valid email.");
  }
  if(req.body.password.length == 0) {
    errors.push('Password cannot be blank');
  }
  if(req.body.password !== req.body.password_confirmation) {
    errors.push('Password and password confirmation must match');
  }
  if(req.body.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if(errors.length) {
    res.render('index', {errors: errors});
  }
  else {
    userCollection.find({email: req.body.email.toLowerCase()}, function (err, data) {
      if (data.length > 0) {
        errors.push('email already in use');
        res.render('index', {errors: errors});
      }
      else {
        userCollection.insert({email: req.body.email.toLowerCase(), passwordDigest: hash}, function (err, data) {
          req.session.username = req.body.email;
          res.redirect('/home');
        });
      }
    });
  }
});

router.post('/signin', function(req, res, next) {
  var errors = [];
  if (req.body.email.length == 0) {
    errors.push("Email cannot be blank");
  }
  if (req.body.password.length == 0) {
    errors.push("Password cannot be blank");
  }
  if (errors.length) {
    res.render('signin', {errors: errors})
  }
  else {
    userCollection.findOne({email: req.body.email}, function (err, data) {
      if (data) {
        if (bcrypt.compareSync(req.body.password, data.passwordDigest)) {
          req.session.username = req.body.email;
          res.redirect('/home');
        }
        else {
          errors.push("Invalid email / password");
          res.render('signin', {errors: errors});
        }
      } else {
        errors.push('Invalid email / password');
        res.render('signin', {errors: errors});
      } 
    });
  }
});

module.exports = router;
