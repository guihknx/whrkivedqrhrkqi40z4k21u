var express = require('express');
var auth = require( '../lib/auth' );
var router = express.Router();



/* POST security challenger check */
router.post('/auth-session/',function(req, res) {
    var cpf = req.body.digits || "";
    var userInput = req.body.digits;
    var currentSessId = req.session.captcha;
    console.log('OK!');
    console.log(userInput , currentSessId)

	if( !parseInt( userInput )  ){
		console.log('ERR')
		res.json({
			error: "Invalid input. Only numbers accepted."
		})	
		return;
	}
	if( userInput != currentSessId ){
		console.log('ERR')
		res.json({
			error: "Invalid input. Please type characters above."
		})
		return;
	}
	if( userInput == currentSessId ){

		console.log(auth)
		console.log("welcome to the system!");
		auth.save(function(token){
			res.json(token)
		});
	}
	
});

module.exports = router;
