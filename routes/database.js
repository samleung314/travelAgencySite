var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
    entity.push(0);
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
    var sql = "INSERT INTO passenger (groupID, fName, lName, age, gender,pass) VALUES ?";
    
    con.query(sql,[values],function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.render('login', { title: 'My Travel Agency' });
});

router.post('/login', function(req, res, next) {
    
    var p= req.body;
    var sql = "SELECT passengerID FROM TravelAgency.passenger WHERE pass = 'thisisabadpass'";
    
    con.query(sql, function (err, result) {
        if (err){
            res.render('login', { title: 'My Travel Agency', message: 'Invalid Credentials'});
        } 
        console.log(result.length);
        if(result[0].passengerID == p.pid){
            res.render('group', { title: 'My Travel Agency'});
        }else{
            res.render('login', { title: 'My Travel Agency', message: 'Invalid Credentials'});
        }
    });
    
    
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to public database!");

  });

module.exports = router;
