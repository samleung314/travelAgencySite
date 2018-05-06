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
    var sql = "SELECT Carrier, FlightNumber, Fare FROM Flight INNER JOIN (SELECT CityID AS depart FROM Location WHERE City = '" + p.departure + "') AS T1 ON src = depart INNER JOIN (SELECT CityID AS arrive FROM Location WHERE City = '" + p.destination + "') AS T2 ON dst = arrive WHERE MONTH(Departure) = " + p.date + " AND Section = '" + p.section + "' AND Availability >= " + p.num;
    console.log(sql);
    con.query(sql, function (err, result) {
        console.log(result);
    });
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to public database!");
  });

module.exports = {router,con};
