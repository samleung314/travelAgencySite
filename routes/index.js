var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Travel Agency' });
});

router.get('/main.hbs', function(req, res, next) {
  res.render('main', { title: 'My Travel Agency' });
});


module.exports = router;
