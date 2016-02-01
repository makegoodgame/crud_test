var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var mongoose = require('mongoose');
var morgan       = require('morgan');
var gcm = require('node-gcm');

mongoose.connect('mongodb://localhost/crud_test'); // connect to our database
var Observer = require('./models/observer.js');
var Board = require('./models/board.js');
var Regid = require('./models/regid.js');
url = 'http://jw4.mju.ac.kr/user/indexSub.action?framePath=unknownboard&siteId=cs&dum=dum&boardId=28510945&page=1&command=list&SWIFT_SESSION_CHK=false';
var ox = false;
var push_title = ""; //보낼 타이틀
var push_link = ""; //보낼 링크

function push_message(p_title,p_link) {
    var message = new gcm.Message({
        collapseKey: 'demo',
        delayWhileIdle: false,
        timeToLive: 1000,
        data: {
            title: '컴퓨터 공학과 홈페이지 알림',
            message: p_title,
            link: p_link,
            category: 'mj_cs'
        }
    });    
    var server_api_key = 'AIzaSyCdgg-17bQ9QDbs0IlCzczgIszVIzGqdE0';
    var sender = new gcm.Sender(server_api_key);
    var registrationIds = [];

    Regid.find({}, function(err, docs){
        docs.forEach(function(output){
            registrationIds.push(output.instance);
        });
        console.log(registrationIds);
        sender.send(message, registrationIds, 4, function (err, result) {
            console.log(result);
        });
    });
}

function output_check(){
    
    request(url, function(error, response, html){

        if(!error){
            var $ = cheerio.load(html);

            var no, title, writer, date, hits, file;
            var array_json = [];
            var json;
            $('#board-container > div.list > form:nth-child(2) > table > tbody > tr').each(function(){
                
                json = new Object();
                no = $(this).find('td').eq(0).text(), json.no = no.replace(/(\r|\n|\t)/gm,"").trim();
                title = $(this).find('td').eq(1).text(), json.title = title.replace(/(\r|\n|\t)/gm,"").trim();       
                writer = $(this).find('td').eq(2).text(), json.writer = writer.replace(/(\r|\n|\t)/gm,"").trim();
                link = $(this).find('a').attr('href'); json.link = 'http://jw4.mju.ac.kr/user/' + link;
                date = $(this).find('td').eq(3).text(), json.date = date.replace(/(\r|\n|\t)/gm,"").trim();
                hits = $(this).find('td').eq(4).text(), json.hits = hits.replace(/(\r|\n|\t)/gm,"").trim();
                file = $(this).find('td').eq(5).text(), json.file = file.replace(/(\r|\n|\t)/gm,"").trim();
                
                if(json.no.length != 0) array_json.push(json);
            })
            array_json.reverse();
        }
        fs.writeFile('mj_cs_output.json', JSON.stringify(array_json, null, 7), function(err){
        });

        //파일 읽고 내용 로그
        fs.readFile('./mj_cs_output.json', 'utf8', function (err, data) {
            Observer.count({category: "mj_cs"}, function(err,count){
                if(count == 0){
                    var first = new Observer({category: "mj_cs"});
                    first.save();                       
                }else{
                    Observer.findOne({category: "mj_cs"}, function(err, doc){
                var Stop = new Error('Stop');
                var new_count = 0;
                ob_value = doc.latest_no;               
                    obj = JSON.parse(data);
                    obj.forEach(function(output){
                        if(output.no > ob_value){                            
                            ox = true ;
                            push_title = output.title;
                            push_link = output.link;
                            doc.latest_no = output.no;
                            doc.save();
                            new_count++;
                        }else{
                            ox = false;
                        }                       
                    });                
            });
                }
            });              
                      
        });       
    });    
    if(ox == true) push_message(push_title,push_link);
}

setInterval( output_check, 30000 );
app.listen('8083');
console.log('Magic happens on port 8083');
exports = module.exports = app;
