var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
var regidSchema = new Schema({
    instance: String       
});

var regidModel = mongoose.model('regid', regidSchema);

module.exports = regidModel;