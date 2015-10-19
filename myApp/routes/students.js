var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/users');
var userCollection = db.get('users');
var studentCollection= db.get('students');

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

router.get('/:id', function(req, res, next) {
  var username = req.session.username;
  studentCollection.findOne({_id: req.params.id}, function (err, data) {
    res.render('show', {student: data, username: username});
  });
});

module.exports = router;
















