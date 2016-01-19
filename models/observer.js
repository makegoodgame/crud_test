var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
var observerSchema = new Schema({
    latest_no:{type:Number, default: 0} 
});

var observerModel = mongoose.model('observer', observerSchema);

module.exports = observerModel;