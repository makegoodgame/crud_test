//메인 컨트롤러.
var app = module.parent.exports.app;
var Regid = require('../models/regid.js');

app.post('/regid_post', function(req, res){
    var r = new Regid({
        instance:req.body.regid
    })
    r.save();
    console.log(req.body.regid);
    res.render('regid_post.ejs');
});