var express = require('express');
var router = express.Router();
var captcha = require('../lib/captcha')


/* GET home page. */
router.get('/', function(req, res) {
	captcha.get_html('6Ldj5moUAAAAAIDT1uWHBBfFexLwnHvO-xMywp2K', function(h){
  		res.render('index', { title: 'Express', captcha:  h });
  	})
});
/* GET home page. */
router.get('/car', function(req, res) {
  res.render('car', { title: 'Express',  });
});

module.exports = router;
