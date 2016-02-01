var express = require('express');
var logger = require('morgan');
var routes = require('./routes/index');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/crud_test');
var app = exports.app = express();

app.set('view engine', 'jade');
app.use(routes);
require('./routes/main.js');
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
