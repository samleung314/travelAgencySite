var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Travel Agency' });
});

router.get('/login.hbs', function(req, res, next) {
  res.render('login', { title: 'My Travel Agency' });
});


module.exports = router;
