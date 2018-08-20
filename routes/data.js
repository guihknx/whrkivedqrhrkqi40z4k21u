var express = require('express');
var request = require('request');
var router = express.Router();
var dataHunter = require( '../lib/fetch' );
var Radar = require( '../lib/plate' );


/* GET poeple info */
router.post('/cpf',function(req, res) {
    var cpf = req.body.id || "";
    var captcha = req.body.captcha || "";
    var requestQuery = req.body;

    if( requestQuery != undefined && requestQuery != '' && requestQuery != null && requestQuery.captcha != undefined && requestQuery.captcha != '' && requestQuery.captcha != null ){
    	var response = requestQuery.captcha;
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=6Ldr6GoUAAAAAK0-Zekp-hvwiSY3cNHXIaktfzSe&response=" +captcha;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                res.status(401).json({"error" : "401 - Unauthorized"});
            }else{
			    dataHunter(cpf,function(err, info){

			    	console.log(arguments);
			        res.json( info || {} );        
			    });
            }
        });
    }else{
        res.status(401).json({"error" : "401 - Unauthorized"});
    }	
});

/* GET poeple info */
router.post('/plate',function(req, res) {
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
