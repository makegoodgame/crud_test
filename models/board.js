var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 
var boardSchema = new Schema({
    no: Number,
    title: String,
    writer: String,
    date: { type:Date, default: new Date('2015-07-07')},
    hits: Number,
    file: String    
});

var boardModel = mongoose.model('board', boardSchema);

module.exports = boardModel;