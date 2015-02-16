var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var acessSchema = new Schema({
	token: { type: String },
	uses: Number,
});

module.exports = mongoose.model('AcessToken', acessSchema);