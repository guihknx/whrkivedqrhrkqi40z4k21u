var request = require('request');
var utils   = require('util');
var iconv = require('iconv');   
var ic = new iconv.Iconv('iso-8859-1', 'utf-8');

function FetchInfo(){
	this.baseWsUri = "https://siteseguro.caixaseguros.com.br/AmparoWeb/AmparoWeb/ajax/";
	this.data = {};
	this.cpf = null;
};

FetchInfo.prototype  = {
	init : function(cpf, token, cb){
		
		var _that = this;

		_that.setCpf(cpf, function(){
			cb(_that.getData());	
		}.bind(this));	
	},
	setCpf: function(cpf, cb){
		this.cpf = cpf;
		this.fetchData(function(data){
			cb(data);	
		});
	},
	setData: function(data){
		return this.data = data;
	},
	getData : function(){
		return this.data || {};
	},
	getMiliseconds :function(){
		return ( + new Date() ) || "";
	},
	getCpf: function(){
		return this.cpf;
	},
	fetchData : function(cb){
		var _that = this
		, url = utils.format(
			"%sbuscaCliente.jsp?_=%s&cpf=%s"
			, this.baseWsUri
			, this.getMiliseconds()
			, this.getCpf()
		
		)
		, fakeId = "siteseguro.caixaseguros.com.br";


		var reqOptions = { 
			url			: url,
			method		: 'GET',
			encoding	: null,
			headers		: {
				'User-Agent'	: "Mozilla/5.0 Firefox/32.0",
				'Host'			: fakeId,
				'Referer'		: fakeId
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
	},
	parseIt: function(stdIn){
		var stdOut = {};

		var holder = stdIn
			.split('Experian;Consulta de Dados da Pessoa por CPF - PF;Existe - ')
			.join(' ')
			.split('\nExperian;Consulta de Dados da Pessoa por CPF - PF;')

		for ( var i = 0 in holder ){

			var chunk = holder[i].split(';');
			
			if( holder[0].split(';')[1] ){
				stdOut['Registro encontrado'] = holder[0].split(';')[1].split('\n')[0];

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
		
		return stdOut;
	}
};

module.exports = new FetchInfo();