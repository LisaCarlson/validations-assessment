var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/users');
var userCollection = db.get('users');
var studentCollection= db.get('students');

/* GET home page. */
router.post('/', function(req, res, next) {
  var errors = [];
  var nameCheck = req.body.name.split(' ');
  var phoneCheck = req.body.phone.split('-');
  if (nameCheck.length == 1) {
    errors.push("Please include first and last name");
  }
  if (phoneCheck.length !== 3) {
    errors.push("Please enter phone number in the format XXX-XXX-XXXX");
  }
  if (req.body.name.length == 0) {
    errors.push("Student name cannot be blank");
  }
  if (!req.body.email.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")){
     errors.push("Email is not valid email.");
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

router.get('/:id', function(req, res, next) {
  var username = req.session.username;
  studentCollection.findOne({_id: req.params.id}, function (err, data) {
    res.render('show', {student: data, username: username});
  });
});

module.exports = router;
















