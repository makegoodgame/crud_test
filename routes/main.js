//메인 컨트롤러.
//Board 모델의 CRUD, 플래시 메시지 출력을 구현했다.

var app = module.parent.exports.app;

//Board 모델을 가져온다.
var Board = require('../models/board.js');
var Regid = require('../models/regid.js');
//list 주소가 왔을 때 
app.get('/list', function(req, res){

	var msg = req.flash('message'); // Read the flash message
    
    Board.find({}, function(err, docs){
        //res.json(docs);
        //리스트 뷰 템플릿을 랜더한다.
        res.render('list', { title: 'List', Board: docs, flashmsg: msg}); // Pass Flash Message to the view
    });
});

//p/new 주소가 오면 , 사람을 추가하는 페이지를 랜더.
app.get('/p/new', function(req, res){
    res.render('new', { title: 'New'});
});


//new에서 post 요청이 오면 펄슨을 저장한다.
app.post('/p/new', function(req, res){
    //res.render('new', { title: 'New'});
    var p = new Board({
        no: req.body.no,
        title: req.body.title,
        writer: req.body.writer,
        //data: req.body.date,
        hits: req.body.hits,
        file: req.body.file
     });
    p.save(function(err, doc){
    	
        if(!err){
        	req.flash('message', '사람을 저장했습니다.'); // Save the flash message
            res.redirect('/list');
        } else {
            res.end(err);    
        }    
    });
});


//get메소드로 delete와 아이디가 주어지면 삭제하자.
app.get('/p/delete/:id', function(req, res){
    Board.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
        	req.flash('message', '사람을 삭제했습니다.'); // Save the flash message
            res.redirect('/list');
        } else {
            res.end(err);    
        }    
    });
});

//수정하기 페이지. get 메소드로 에디트 주소가 오면 에디트 페이지를 랜더.
app.get('/p/edit/:id', function(req, res){
    Board.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit', board: doc});
        } else {
            res.end(err);    
        }    
    });
});

//수정한 것을 등록한다. post
app.post('/p/edit/:id', function(req, res){
    Board.findOne({ _id: req.params.id }, function(err, doc){
    	
        if(!err){
            doc.name = req.body.name; 
            doc.age = req.body.age;
            doc.save(function(err, doc){
                if(!err){
                	req.flash('message', '사람을 수정했습니다.'); // Save the flash message
                    res.redirect('/list');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }    
    });
});

app.post('/regid_post', function(req, res){
    var r = new Regid({
        instance:req.body.regid
    })
    r.save();
    console.log(req.body.regid);
    res.render('regid_post.ejs');
});