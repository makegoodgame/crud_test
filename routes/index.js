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
router.post('/regid_post', function(req, res){
    var r = new Regid({
        instance:req.body.regid
    })
    r.save();
    console.log(req.body.regid);
    res.render('regid_post.ejs');
});

module.exports = router;
