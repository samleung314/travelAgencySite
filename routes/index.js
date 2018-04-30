var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Travel Agency' });
});

router.get('/login.hbs', function(req, res, next) {
  res.render('login', { title: 'My Travel Agency' });
});

router.get('/reviews.hbs', function(req, res, next) {
  res.render('reviews', { title: 'My Travel Agency' });
});

router.get('/balance.hbs', function(req, res, next) {
  res.render('balance', { title: 'My Travel Agency' });
});


module.exports = router;
