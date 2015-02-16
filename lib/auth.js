var mongoose = require('mongoose');
var tkModel  = require('./models/tokenModel.js');


var Auth = {
	db: null,
	init :function(cb) {
		this.db = mongoose.connection;
		var _that = this;

		this.db.on('error', console.error);
		this.db.once('open', function() {
			console.log('connection OK!')
			// _that.initSchemas(function(){
			// 	cb();
			// });
		});

		mongoose.connect('mongodb://localhost/test');
		cb();
	},
	initSchemas: function(cb){

	},
	save :function(cb) {

		var _that = this;

		this.init(function(){

			var newToken = new tkModel({
				token: Math.random().toString(36).substr(2),
				uses: "0",
			});

			newToken.save(function(err, newToken) {
				if (err) {
					return console.error(err);
				}
				console.log(newToken)
				cb({ _token: newToken.token });
				// _that.db.close();
			});		

		});

		// this.initSchemas();


	},
};

module.exports = Auth;