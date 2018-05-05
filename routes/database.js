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
    entity.push(p.email);
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
    var sql = "INSERT INTO passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";
    
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
    var sql = "SELECT pass,fName FROM TravelAgency.passenger WHERE email = '"+p.email +"'";
    
    con.query(sql, function (err, result) {
        if(result.length == 1 && result[0].pass == p.pass){
            res.cookie('name',result[0].fName);
            res.cookie('email',p.email);
            res.redirect('/')
        }else{
            res.render('login', { title: 'My Travel Agency', logged: "Login",message: 'Invalid Credentials', layout: "nonuser"});
        }
    });
    
    
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to public database!");

  });

module.exports = router;
