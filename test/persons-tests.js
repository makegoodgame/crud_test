var Person = require('../models/persons');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/crud_test');

var p = new Person({ name:"Cristian", age:27 });
p.save(function(err, doc){
    console.log(err, doc);    
});