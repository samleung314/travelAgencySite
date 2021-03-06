var express = require('express');
var router = express.Router();
var database = require('./database');

logValue = "Login";
loggedIn = false;
function setLogged(req){
  //Keeps track of whether user is logged in or out
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
    //FIND THE GROUP
    var sql = "SELECT * FROM TravelAgency.Passenger WHERE groupID = '" + req.cookies.groupID + "'";
    database.con.query(sql, function (err, result) {
      if(err) next()
      else{
        //if group is found, list all passengers with same group in table
        var list = []
        for(var i = 0; i < result.length; i++){
          var p1 = result[i].email;
          var p2 = result[i].fName;
          var p3 = result[i].lName;
          var p4 = result[i].age;
          var person = { email: p1, fname: p2, lname: p3, age: p4 };
          list.push(person);
        }

        var context = {languages: list, logged: logValue};
        res.render('homepage', context);
      }
    });

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
    res.cookie('passengerID', "")
    res.cookie('groupID', "")
    res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser"});
  }
});

//Rest is all routing
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
