var express = require('express');
var router = express.Router();
var dataHunter = require( '../lib/fetch' );


/* GET poeple info */
router.get('/fetch/',function(req, res) {
    var cpf = req.query.id || "";

    dataHunter.init(cpf, req.query.token,function(info){
        res.json( info || {} );        
    });
 

});

module.exports = router;
