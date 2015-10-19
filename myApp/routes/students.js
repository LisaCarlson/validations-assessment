var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/users');
var userCollection = db.get('users');
var studentCollection= db.get('students');
var bcrypt = require('bcrypt');

/* GET home page. */
router.post('/', function(req, res, next) {
  var errors = [];
  if (req.body.name.length == 0) {
    errors.push("Student name cannot be blank");
  }
  if (req.body.phone.length == 0) {
    errors.push("Phone number cannot be blank");
  }
  if (req.body.email.length == 0) {
    errors.push("Email cannot be blank");
  }
  if (errors.length) {
    res.render('home', {errors: errors})
  }
  else {
    studentCollection.findOne({email: req.body.email.toLowerCase()}, function (err, data) {
      if (data) {
        errors.push('Student already exists in database');
        res.render('home', {errors: errors});
      } else {
          studentCollection.insert({name: req.body.name, phone: req.body.phone, email: req.body.email});
          res.redirect('/home');
        }      
    });
  }

});

module.exports = router;