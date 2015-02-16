var request = require('request');
var utils   = require('util');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');
var iconv = require('iconv');   
var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
var AcessModel = require('./models/tokenModel.js');




var fetchInfo = function(){
	this.baseWsUri = "https://siteseguro.caixaseguros.com.br/AmparoWeb/AmparoWeb/ajax/";
	this.data = {};
	this.cpf = null;
};
fetchInfo.prototype.init = function(cpf, token, cb){


	var _that = this;

	AcessModel.findOne({ token: ""+token }, function(err, entry) {
		if (err) {
			return console.error(err);
		}

		if( entry == null ){
			cb({'error': 'Invalid token!', 'level': 99});
			return;
		}else{
			if( parseInt( entry.uses ) > 5 ){
				cb({'error': 'Expired token!', 'level': 100});
				return;
			}else{

				_that.setCpf(cpf, function(){
					cb(_that.getData());	
				}.bind(this));	

				AcessModel.update(
					{ token: ""+token }
					, { 
						$inc: {
							uses: ( parseInt( entry.uses ) +1) 
						}
					}
					,  { multi: true }
					, function(err, affectedRows){}
				);
				
			}
		}
	}.bind(this));
		// console.log(cpf)
	
};

fetchInfo.prototype.setCpf = function(cpf, cb){
	this.cpf = cpf;
	this.fetchData(function(data){
		cb(data);	
	});
};
fetchInfo.prototype.setData = function(data){
	return this.data = data;
};
fetchInfo.prototype.getData = function(){
	return this.data || {};
};
fetchInfo.prototype.getMiliseconds = function(){
	return ( + new Date() ) || "";
};
fetchInfo.prototype.getCpf = function(){
	return this.cpf;
};
fetchInfo.prototype.fetchData = function(cb){
	var _that = this
	, url = utils.format(
		"%sbuscaCliente.jsp?_=%s&cpf=%s"
		, this.baseWsUri
		, this.getMiliseconds()
		, this.getCpf()
	
	)
	, fakeId = "siteseguro.caixaseguros.com.br";
	// console.log(url)
	var reqOptions = { 
		url		: url,
		method	: 'GET',
		encoding: null,
		headers	: {
			'User-Agent': "Mozilla/5.0 Firefox/32.0",
			'Host': fakeId,
			'Referer': fakeId
		}
	};

	request(reqOptions, function (error, response, body) {

		if( null != body ){
			var buf = ic.convert(body);                                                   
			var utf8String = buf.toString('utf-8');  

			var parsedData = this.parseIt( utf8String );

			cb( this.setData( parsedData ) );

		}
	}.bind(this));
};
fetchInfo.prototype.parseIt = function(stdIn){
	var stdOut = {};

// console.log(stdIn)
	var holder = stdIn
		.split('Experian;Consulta de Dados da Pessoa por CPF - PF;Existe - ')
		.join(' ')
		.split('\nExperian;Consulta de Dados da Pessoa por CPF - PF;')

		// console.log(holder)
	for ( var i = 0 in holder ){

		var chunk = holder[i].split(';');
		
		if( holder[0].split(';')[1] ){
			stdOut['Registro encontrado'] = holder[0].split(';')[1].split('\n')[0];
			// console.log('CHUNK0', chunk[0])
			var propName = chunk[0]
			.replace(/^\s+|\s+$/g, '')
			.split(' - ')[1];


			stdOut[propName] = chunk[1];				
		
		}else{
			stdOut = {
				error: "Couldn't read or parse payload data."
			};
			// return false;

		}
	}

	if( Object.keys(stdOut).length < 5  ){
		stdOut = {
			error: "There's no data!"
		};
		// return false;
	}
	
	// console.log(stdOut)
	return stdOut;
};


// var fetchInfo = {
// 		baseWsUri: "https://siteseguro.caixaseguros.com.br/AmparoWeb/AmparoWeb/ajax/",
// 		data: {},
// 		cpf: null,
// 		init 			: function(cpf, cb){

// 			this.setCpf(cpf, function(data){
// 				cb(this.getData());
// 			}.bind(this));

// 		},
// 		setCpf 			: function(cpf, cb){

// 			this.cpf = cpf;
			
// 			this.fetchData(function(data){
// 				cb(data)
// 			});
			
// 		},
// 		setData 		: function(data){
// 			return this.data = data;
// 		},
// 		getData			: function(){
// 			return this.data || {};
// 		},
// 		getMiliseconds	: function(){
// 			return ( +new Date() ) || '';
// 		},
// 		getCpf 			: function(){
// 			return this.cpf;
// 		},
// 		fetchData 		: function(cb){

// 			var _that = this
// 			, url = utils.format( 
// 				"%sbuscaCliente.jsp?_=%s&cpf=%s"
// 				, this.baseWsUri
// 				, this.getMiliseconds()
// 				, this.getCpf()
// 			)
// 			, fakeId = "siteseguro.caixaseguros.com.br"
// 			;

	
// 			var reqOptions = { 
// 				url		: url,
// 				method	: 'GET',
// 				headers	: {
// 					'User-Agent': "Mozilla/5.0 Firefox/32.0",
// 					'Host': fakeId,
// 					'Referer': fakeId
// 				}
// 			};

// 			request(reqOptions, function (error, response, body) {

// 				if( null != body ){

// 					var parsedData = this.parseIt( body );

// 					cb( this.setData( parsedData ) );

// 				}
// 			}.bind(this));
// 		},
// 		parseIt 		: function(stdIn){
// 			var stdOut = {};

// 			var holder = stdIn
// 			.split('Experian;Consulta de Dados da Pessoa por CPF - PF;Existe - ')
// 			.join(' ')
// 			.split('Discreta - ')
// 			.join(' ')
// 			.split("\nExperian;Consulta de Dados da Pessoa por CPF - PF;");


// 			for ( var i = 0 in holder ){

// 				var chunk = holder[i].split(';');
				
// 				if( holder[0].split(';')[1] ){
// 					stdOut['registro-encontrado'] = holder[0].split(';')[1].split('\n')[0];
// 					var propName = chunk[0]
// 					.replace(/^\s+|\s+$/g, '')
// 					.toLowerCase()
// 					.replace(/ /g,'-')
// 					.replace(/[-]+/g, '-')
// 					.replace(/[^\w-]+/g,'');

// 					stdOut[propName] = chunk[1];				
				
// 				}else{
// 					stdOut = {
// 						error: "Couldn't read or parse payload data."
// 					};
// 					// return false;

// 				}
// 			}

// 			if( Object.keys(stdOut).length < 5  ){
// 				stdOut = {
// 					error: "There's no data!"
// 				};
// 				// return false;
// 			}
			
// 			// console.log(stdOut)
// 			return stdOut;
// 		}
// };

module.exports = new fetchInfo();
