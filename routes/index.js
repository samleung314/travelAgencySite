var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Travel Agency' });
});

router.get('/login.hbs', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/register.hbs', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/reviews.hbs', function(req, res, next) {
  res.render('reviews', { title: 'My Travel Agency' });
});

router.get('/balance.hbs', function(req, res, next) {
  res.render('balance', { title: 'My Travel Agency' });
});

router.get('/group.hbs', function(req, res, next) {
  res.render('group', { title: 'My Travel Agency' });
});

router.get('/flight.hbs', function(req, res, next) {
  res.render('flight', { title: 'My Travel Agency' });
});

router.get('/carrental.hbs', function(req, res, next) {
  res.render('carrental', { title: 'My Travel Agency' });
});

router.get('/cruise.hbs', function(req, res, next) {
  res.render('cruise', { title: 'My Travel Agency' });
});

router.get('/accommodation.hbs', function(req, res, next) {
  res.render('accommodation', { title: 'My Travel Agency' });
});

router.get('/employee.hbs', function(req, res, next) {
  res.render('employee', { title: 'My Travel Agency' });
});

router.get('/location.hbs', function(req, res, next) {
  res.render('location', { title: 'My Travel Agency' });
});1

module.exports = router;
