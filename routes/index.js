var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express',  });
});
/* GET home page. */
router.get('/car', function(req, res) {
  res.render('car', { title: 'Express',  });
});

module.exports = router;
