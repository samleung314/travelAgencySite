var express = require('express');
var router = express.Router();
var mysql = require('mysql');

function getLevel(req) {
  var sql = "INSERT INTO Passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";

  con.query(sql, [values], function (err, result) {
    if (err) {
      res.render('register', { title: 'My Travel Agency', logged: "Login", message: err.sqlMessage, layout: "nonuser" });
    } else {
      res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser" });
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
router.post('/register', function (req, res, next) {
  var sql = "INSERT INTO PGroup(GroupID, SourceLocation, DestinationLocation, TransportType, Purpose) VALUES (0,null,null,null,null)";
  var groupID = 0;
  con.query(sql, function (err, result) {
    if (err) {
      res.render('register', { title: 'My Travel Agency', logged: "Login", message: err.sqlMessage, layout: "nonuser" });
    } else {
      var p = req.body;
      var entity = [];
      entity.push(p.email);
      entity.push(result.insertId);
      entity.push(p.fname);
      entity.push(p.lname);
      entity.push(p.age);
      entity.push(p.gender);
      entity.push(p.pass);
      var values = [entity];
      var sql = "INSERT INTO Passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";

      con.query(sql, [values], function (err, result) {
        if (err) {
          res.render('register', { title: 'My Travel Agency', logged: "Login", message: err.sqlMessage, layout: "nonuser" });
        } else {
          res.render('login', { title: 'My Travel Agency', logged: "Login", layout: "nonuser" });
        }
      });
    }
  });


});

router.post('/updateGroup', function(req,res,next){
  console.log();
  var src = req.body.type[0];
  var dest = req.body.type[1];
  var purp = req.body.type[2];
  var trans = req.body.type[3];
  var entity = [];
  entity.push(0);
  entity.push(src);
  entity.push(dest);
  entity.push(purp);
  entity.push(trans);
  var values = [entity];
  var sql = "INSERT INTO TravelAgency.PGroup (GroupID,SourceLocation,DestinationLocation,TransportType,Purpose) VALUES ?";
  con.query(sql, [values],function (err, result) {
    if(err){
      console.log(err);
      res.redirect(404);
    }else{
      res.redirect('/');
    }
  });
});

router.post('/delete', function (req, res, next) {
  var sql = "DELETE FROM TravelAgency.Passenger WHERE email = '" + req.body.value + "'";
  con.query(sql, function (err, result) {
    if(err){
      console.log(err)
    }else{
      console.log(result);
      res.redirect('/');
    }
  });
});

router.post('/login', function (req, res, next) {
  var p = req.body;
  var sql = "SELECT * FROM TravelAgency.Passenger WHERE email = '" + p.email + "'";
  console.log(p.pass);
  con.query(sql, function (err, result) {
    if(result.length == 0){
      res.render('login', { title: 'My Travel Agency', logged: "Login", message: 'Invalid Credentials', layout: "nonuser" });
      return;
    }
    if(err){
      res.render('login', { title: 'My Travel Agency', logged: "Login", message: 'Invalid Credentials', layout: "nonuser" });
    }
    
    if (result.length == 1 && result[0].pass == p.pass) {
      res.cookie('groupID', result[0].groupID);
      res.cookie('passengerID', result[0].passengerID);
      res.cookie('name', result[0].fName);
      res.cookie('email', p.email);
      console.log("Logged In: " + p.email);
      res.redirect('/')
    } else {
      res.render('login', { title: 'My Travel Agency', logged: "Login", message: 'Invalid Credentials', layout: "nonuser" });
    }
  });
});

router.post('/flight', function (req, res, next) {
  var p = req.body;
  var sql = "SELECT Carrier, FlightNumber, Departure, Fare FROM Flight INNER JOIN (SELECT CityID AS depart, City AS A FROM Location WHERE City = '" + p.departure + "') AS T1 ON src = depart INNER JOIN (SELECT CityID AS arrive, City AS B FROM Location WHERE City = '" + p.destination + "') AS T2 ON dst = arrive WHERE MONTH(Departure) = " + p.date + " AND Section = '" + p.section + "' AND Availability >= " + p.num + " ORDER BY Departure ASC";
  con.query(sql, function (err, result) {
    if (result != null) {
      for (var i = 0; i < result.length; i++) {
        var newDate = result[i].Departure.toString().substr(0, 15);
        result[i].Departure = newDate;
      }
    }
    res.render('foundflights', { title: 'My Travel Agency', flights: result, section: p.section, depart: p.departure, arrive: p.destination, num: p.num });
  });
});

router.post('/cruise', function (req, res, next) {
  var p = req.body;
  var sql = "SELECT Carrier, CruiseNumber, Departure, Fare FROM Cruise INNER JOIN (SELECT CityID AS depart, City AS A FROM Location WHERE City = '" + p.departure + "') AS T1 ON src = depart INNER JOIN (SELECT CityID AS arrive, City AS B FROM Location WHERE City = '" + p.destination + "') AS T2 ON dst = arrive WHERE MONTH(Departure) = " + p.date + " AND Availability >= " + p.num + " ORDER BY Departure ASC";
  con.query(sql, function (err, result) {
    if (result != null) {
      for (var i = 0; i < result.length; i++) {
        var newDate = result[i].Departure.toString().substr(0, 15);
        result[i].Departure = newDate;
      }
    }
    res.render('foundcruises', { title: 'My Travel Agency', cruises: result, depart: p.departure, arrive: p.destination, num: p.num });
  });
});



router.post('/review', function(req, res, next) {
  var p= req.body;
  var email = req.cookies.email;
  var sql = "INSERT INTO Reviews(Rating, DetailedReview, GroupID) VALUES ('" + p.rating + "', '" + p.review + "', (SELECT groupID FROM Passenger WHERE email = '" + email + "')) ON DUPLICATE KEY UPDATE Rating = '" + p.rating + "', DetailedReview = '" + p.review + "'";
  console.log(sql);
  con.query(sql, function (err, result) {
    res.render('reviews', {title: 'My Travel Agency', message: "Your review has been submitted!"});
  });
});

router.post('/accommodation', function(req, res, next) {
  var p = req.body;
  var amen = [];
  if (p.lounge == 1) {
    amen.push("Lounge");
  }
  if (p.gym == 1) {
    amen.push("Gym");
  }
  if (p.pool == 1) {
    amen.push("Pool");
  }
  amen = amen.join(" = 1 AND ");
  if (amen != "") {
    amen += " = 1 ";
  } else {
    amen = "1 = 1";
  }
  var sql = "SELECT ID, Address, RoomNumber, Rate FROM Accommodation INNER JOIN (SELECT ID AS hotel FROM Amenities WHERE " + amen + ") AS T1 ON Accommodation.ID = hotel INNER JOIN (SELECT * FROM Room WHERE OccupiedFrom IS NULL) AS T2 ON HotelID = Accommodation.ID INNER JOIN (SELECT CityID, City AS CityName FROM Location) AS T3 ON City = CityID WHERE AType = '" + p.type + "' AND CityName = '" + p.city + "' ORDER BY Address ASC";
  var year = p.date.substr(0, 4);
  var day = p.date.substr(5, 2);
  var month = p.date.substr(8);
  if (!(/^\d+$/.test(year) && /^\d+$/.test(day) && /^\d+$/.test(month))) {
    p.date = "1999-12-31"; //default date
  }
  con.query(sql, function (err, result) {
    res.render('foundrooms', { title: 'My Travel Agency', rooms: result, city: p.city, atype: p.type, gym: p.gym, lounge: p.lounge, pool: p.pool, checkin: p.date });
  });
});

router.post('/bookflight', function (req, res, next) {
  var p = req.body;
  var sql = "UPDATE Flight SET Availability = Availability - " + p.ticketsBooked + " WHERE FlightNumber = '" + p.book + "' AND Section = '" + p.section + "'";
  console.log(p.ticketsBooked + " " + p.section + " class tickets booked on flight " + p.book);
  con.query(sql, function (err, result) {
    res.render('foundflights', { title: 'My Travel Agency', message: "Your flight has been booked!" });
  });
});

router.post('/bookcruise', function (req, res, next) {
  var p = req.body;
  var sql = "UPDATE Cruise SET Availability = Availability - " + p.ticketsBooked + " WHERE CruiseNumber = '" + p.book + "'";
  console.log(p.ticketsBooked + " tickets booked on cruise " + p.book);
  con.query(sql, function (err, result) {
    res.render('foundcruises', { title: 'My Travel Agency', message: "Your cruise has been booked!" });
  });
});

router.post('/bookroom', function (req, res, next) {
  var p = req.body;
  var room = p.book.substr(0, 3);
  var hotelid = p.book.substr(3);
  var sql = "UPDATE Room SET OccupiedFrom = '" + p.date + "' WHERE RoomNumber = '" + room + "' AND HotelID = '" + hotelid + "'"; //add occupiedby groupid
  con.query(sql, function (err, result) {
    res.render('foundrooms', { title: 'My Travel Agency', message: "Your room has been booked!" });
  });
});

router.post('/addPassenger', function (req, res, next) {
  var p = req.body;
  var n1 = p.fName;
  var n2 = p.lName;
  var n3 = p.age;
  var n4 = p.email;

  var entity = [];
  entity.push(p.email);
  entity.push(req.cookies.groupID);
  entity.push(p.fName);
  entity.push(p.lName);
  entity.push(p.age);
  entity.push(p.gender);
  entity.push(null);
  var values = [entity];
  var sql = "INSERT INTO Passenger (email, groupID, fName, lName, age, gender,pass) VALUES ?";

  con.query(sql, [values], function (err, result) {
    if (err) {
      console.log("ERROR")
      console.log(err);
      res.redirect('/')
    } else {
      console.log(result);
      res.redirect('/')
    }
  });

});

router.post('/updateGroup', function (req, res, next) {

});

router.post('/payment', function(req, res, next) {
  var values = [];
  values.push(req.body.payment);
  values.push(req.body.cardnum);
  values.push(req.body.expiryDate);

  var valuesA = [values];
  var sql = "INSERT INTO Payment (PaymentType, CardNumber, CardExpiryDate) VALUES ?"
  con.query(sql, [valuesA], function (err, result) {
    if(err) console.log(err.sqlMessage)
    res.render('balance', { title: 'My Travel Agency', success: 'Payment Success!', payment: req.body.payment, cardnum: req.body.cardnum, expiryDate: req.body.expiryDate});
  });



});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to public database!");
});

module.exports = { router, con };
