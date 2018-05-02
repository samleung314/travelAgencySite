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
router.post('/', function(req, res, next) {
    var p= req.body;
    var values = "(0,'"+p.firstname+"', '"+p.lastname+"', '"+ p.gender +"', "+p.age+")";
    var sql = "INSERT INTO passenger (groupID, fName, lName, gender, age) VALUES"+values;
    
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.render('login', { title: 'My Travel Agency' });
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to public database!");

  });

module.exports = router;
