var express = require('express');
var router = express.Router();
var dataHunter = require( '../lib/fetch' );
var Radar = require( '../lib/plate' );


/* GET poeple info */
router.get('/cpf/:id',function(req, res) {
    var cpf = req.params.id || "";
    console.log(cpf)

    dataHunter(cpf,function(err, info){

    	console.log(arguments);
        res.json( info || {} );        
    });
});

/* GET poeple info */
router.get('/plate/:id',function(req, res) {
    var plate = req.params.id || "";
    console.log(plate)

    Radar(plate, function(err, info){

    	if(  err ) return res.json( err || {} );     

    	if( info.chassi.indexOf('*') > -1 ){
    		info.partial = true;
    	}

    	console.log(arguments);
        res.json( info || {} );        
    });
});

module.exports = router;
