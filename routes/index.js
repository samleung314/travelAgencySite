var express = require('express');
var router = express.Router();
var database = require('./database');

logValue = "Login";
loggedIn = false;
function setLogged(req){
  if(req.cookies.name == "" && req.cookies.email == ""){
    logValue = "Login"
    loggedIn = false;
  }else{
    logValue = "Logout"
    loggedIn = true;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  setLogged(req);
  if(!loggedIn){ //if you are logged out
    res.render('login', {title: "Travel Agency", logged: logValue, message: "Welcome new user. Please Login!", layout: "nonuser"})
  }else{
    res.render('homepage', {title: "Travel Agency", logged: logValue, message: req.cookies.name})
  }
});

router.get('/login.hbs', function(req, res, next) {
  if(!loggedIn){
    //if you are logged out
    //login
    res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser" });
  }else{
    //if you are logged in
    //logout
    res.cookie('name', "")
    res.cookie('email', "")
    res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser"});
  }
});

router.get('/register.hbs', function(req, res, next) {
  setLogged(req);
  res.render('register', { title: 'Register', logged: logValue, layout: "nonuser" });
});

router.get('/reviews.hbs', function(req, res, next) {
  setLogged(req);
  res.render('reviews', { title: 'My Travel Agency', logged: logValue });
});

router.get('/balance.hbs', function(req, res, next) {
  setLogged(req);
  res.render('balance', { title: 'My Travel Agency', logged: logValue });
});

router.get('/group.hbs', function(req, res, next) {
  setLogged(req);
  res.render('group', { title: 'My Travel Agency', logged: logValue });
});

router.get('/flight.hbs', function(req, res, next) {
  setLogged(req);
  res.render('flight', { title: 'My Travel Agency', logged: logValue });
});

router.get('/carrental.hbs', function(req, res, next) {
  setLogged(req);
  res.render('carrental', { title: 'My Travel Agency', logged: logValue });
});

router.get('/cruise.hbs', function(req, res, next) {
  setLogged(req);
  res.render('cruise', { title: 'My Travel Agency', logged: logValue });
});

router.get('/accommodation.hbs', function(req, res, next) {
  setLogged(req);
  res.render('accommodation', { title: 'My Travel Agency', logged: logValue });
});

router.get('/employee.hbs', function(req, res, next) {
  setLogged(req);
  res.render('employee', { title: 'My Travel Agency', logged: logValue });
});

router.get('/location.hbs', function(req, res, next) {
  setLogged(req);
  res.render('location', { title: 'My Travel Agency', logged: logValue });
});

router.get('/foundflights.hbs', function(req, res, next) {
  setLogged(req);
  res.render('foundflights', { title: 'My Travel Agency', logged: logValue });
});

router.get('/postedreviews.hbs', function(req, res, next) {
    var sql = "SELECT Rating, DetailedReview, fName FROM Reviews INNER JOIN Passenger ON Reviews.GroupID=Passenger.groupID AND Passenger.pass IS NOT NULL";
    database.con.query(sql, function (err, result) {
        console.log(result);
        res.render('postedreviews', { title: 'My Travel Agency', logged: logValue, reviews: result });
    });
});

module.exports = router;
