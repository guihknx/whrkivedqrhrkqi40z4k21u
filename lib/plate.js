var request = require('request');

function getPrimary(plate, callback){
	console.log('*** geting first', plate)
	request({
		method: 'POST',
		url:     'http://ws.carcheck.com.br/consultar/pegarDadosVeiculoTelaInicial',
		form:    '{"placa": '+plate+',"tokenRecaptcha": "XXX"}',
	}, function(error, response, body){

		if( response.statusCode !== 200 )
			return callback({error: 'Can\'t find plate!'});
		body = JSON.parse(body);
		callback(null, body);
	});
}


function getSecoundary(info, callback){
	console.log('*** geting 2rd', info.placa)

	request({
		method: 'POST',
		url:     'https://api.olhonocarro.com.br/api/test-drive',
		body:    '{"duplicity":false,"key":"'+info.placa+'","email":"vidubo+'+(+new Date)+'@hurify1.com"}',
		headers:{
  			'Content-Type': 'application/json;charset=utf-8',
		},
	}, function(error, response, body){

		if( response.statusCode !== 200 && info )
			return callback(null, info);


		if( response.statusCode !== 200 )
			return callback({error: 'Can\'t find plate!'});

		body = JSON.parse(body);

		info = Object.assign(info,body.body)
		callback(null, info);
	});


}

function Radar(plate, fn){
	var async = require('async')
	async.waterfall([
		async.apply(getPrimary, plate),
	    getSecoundary,
	], function (err, result) {
		if( err )
			return fn(err, null);
		
		fn(null, result);
	});
	
}


module.exports = Radar;