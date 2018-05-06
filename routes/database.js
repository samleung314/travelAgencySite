var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function getLevel(req){
    var sql = "INSERT INTO Passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";

    con.query(sql,[values],function (err, result) {
        if (err){
            res.render('register', { title: 'My Travel Agency', logged: "Login", message: err.sqlMessage, layout: "nonuser"});
        }else{
            res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser"});
        }

    });
}

//Database
var con = mysql.createConnection({
    host: "54.165.71.152",
    user: "admin",
    password: "password",
    database: "TravelAgency",
  });


/* GET home page. */
router.post('/register', function(req, res, next) {
    var p= req.body;
    var entity = [];
    entity.push(p.email);
    entity.push(null);
    entity.push(p.fname);
    entity.push(p.lname);
    if(Number.isInteger(p.age)){
        entity.push(p.age);
    }else{
        entity.push(null);
    }
    entity.push(p.gender);
    entity.push(p.pass);
    var values = [entity];
    var sql = "INSERT INTO Passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";

    con.query(sql,[values],function (err, result) {
        if (err){
            res.render('register', { title: 'My Travel Agency', logged: "Login", message: err.sqlMessage, layout: "nonuser"});
        }else{
            res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser"});
        }

    });
});

router.post('/login', function(req, res, next) {
    var p= req.body;
    var sql = "SELECT pass,fName FROM TravelAgency.Passenger WHERE email = '"+p.email +"'";
    con.query(sql, function (err, result) {
        if(result.length == 1 && result[0].pass == p.pass){
            res.cookie('name',result[0].fName);
            res.cookie('email',p.email);
            console.log("Logged In: "+p.email);
            res.redirect('/')
        }else{
            res.render('login', { title: 'My Travel Agency', logged: "Login",message: 'Invalid Credentials', layout: "nonuser"});
        }
    });
});

router.post('/flight', function(req, res, next) {
    var p= req.body;
    var sql = "SELECT Carrier, FlightNumber, Departure, Fare FROM Flight INNER JOIN (SELECT CityID AS depart, City AS A FROM Location WHERE City = '" + p.departure + "') AS T1 ON src = depart INNER JOIN (SELECT CityID AS arrive, City AS B FROM Location WHERE City = '" + p.destination + "') AS T2 ON dst = arrive WHERE MONTH(Departure) = " + p.date + " AND Section = '" + p.section + "' AND Availability >= " + p.num + " ORDER BY Departure ASC";
    con.query(sql, function (err, result) {
      if(result != null){
        for (var i = 0; i < result.length; i++) {
            var newDate = result[i].Departure.toString().substr(0,15);
            result[i].Departure = newDate;
        }
      }
      res.render('foundflights', {title: 'My Travel Agency', flights: result, section: p.section, depart: p.departure, arrive: p.destination, num: p.num});
    });
});

router.post('/cruise', function(req, res, next) {
    var p= req.body;
    var sql = "SELECT Carrier, CruiseNumber, Departure, Fare FROM Cruise INNER JOIN (SELECT CityID AS depart, City AS A FROM Location WHERE City = '" + p.departure + "') AS T1 ON src = depart INNER JOIN (SELECT CityID AS arrive, City AS B FROM Location WHERE City = '" + p.destination + "') AS T2 ON dst = arrive WHERE MONTH(Departure) = " + p.date + " AND Availability >= " + p.num + " ORDER BY Departure ASC";
    con.query(sql, function (err, result) {
      if(result != null){
        for (var i = 0; i < result.length; i++) {
            var newDate = result[i].Departure.toString().substr(0,15);
            result[i].Departure = newDate;
        }
      }
      res.render('foundcruises', {title: 'My Travel Agency', cruises: result, depart: p.departure, arrive: p.destination, num: p.num});
    });
});

router.post('/bookflight', function(req, res, next) {
    var p= req.body;
    var sql = "UPDATE Flight SET Availability = Availability - " + p.ticketsBooked + " WHERE FlightNumber = '" + p.book + "' AND Section = '" + p.section + "'";
    console.log(p.ticketsBooked + " " + p.section + " class tickets booked on flight " + p.book);
    con.query(sql, function (err, result) {
      res.render('foundflights', {title: 'My Travel Agency', message: "Your flight has been booked!"});
    });
});

router.post('/bookcruise', function(req, res, next) {
    var p= req.body;
    var sql = "UPDATE Cruise SET Availability = Availability - " + p.ticketsBooked + " WHERE CruiseNumber = '" + p.book + "'";
    console.log(p.ticketsBooked + " tickets booked on cruise " + p.book);
    con.query(sql, function (err, result) {
      res.render('foundcruises', {title: 'My Travel Agency', message: "Your cruise has been booked!"});
    });
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to public database!");
  });

module.exports = {router,con};
