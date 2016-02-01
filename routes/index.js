var express = require('express');
var Regid = require('../models/regid.js');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/regid_post', function(req, res) {
  res.render('regid_post.ejs');
});

module.exports = router;
