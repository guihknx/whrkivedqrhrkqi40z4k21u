var express = require('express');
var router = express.Router();
var auth = require( '../lib/auth' );

/* GET home page. */
router.get('/', function(req, res) {
	console.log(auth)
  res.render('index', { title: 'Express',  });
});

module.exports = router;
