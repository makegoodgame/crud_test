var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var mongoose = require('mongoose');
var morgan       = require('morgan');
var gcm = require('node-gcm');
mongoose.connect('mongodb://localhost/crud_test'); 
var Regid = require('./models/regid.js');
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        title: 'saltfactory GCM demo',
        message: 'Google Cloud Messaging 테스트',
        custom_key1: 'custom data1',
        custom_key2: 'custom data2'
    }
});
var server_api_key = 'AIzaSyCdgg-17bQ9QDbs0IlCzczgIszVIzGqdE0';
var sender = new gcm.Sender(server_api_key);
var registrationIds = [];
Regid.find({}, function(err, docs){
    docs.forEach(function(output){
        registrationIds.push(output.instance);
    });
});
sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});
