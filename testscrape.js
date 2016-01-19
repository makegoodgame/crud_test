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
url = 'http://localhost:3000/list';
var ox = false;

var push_title = ""; //보낼 타이틀


function push_message(title) {
    var message = new gcm.Message({
        collapseKey: 'demo',
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            key1: title,
            key2: 'saltfactory push demo'
        }
    });

    var server_access_key = 'AIzaSyCfpln55R5GEXaYuDNs1sdKlkRmhAgEVOY';
    var sender = new gcm.Sender(server_access_key);
    var registrationIds = [];

    var registration_id = 'APA91bHJ_PmCe8EsFBNTZLYI2gfgnSWCnvD1tIl5hXJQcTr_YtRBcbC__ust0fV8q1rtGfW4bzT8ZSf9Xy5F2yxTK1W1vW-U6F9by8TsT_Z6wRlXXki_2sZG9tUlWfS0NWrx-rSa7QWi';
    // At least one required
    registrationIds.push(registration_id);

    /**
     * Params: message-literal, registrationIds-array, No. of retries, callback-function
     **/
    sender.send(message, registrationIds, 4, function (err, result) {
        console.log(result);
    });
}


function output_check(){
        
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var no, title, writer, date, hits, file;
            var array_json = [];
            var json;
            $('table tr').each(function(){
                json = new Object();
                no = $(this).find('td').eq(0).text(), json.no = no.replace(/(\r|\n|\t)/gm,"").trim();
                title = $(this).find('td').eq(1).text(), json.title = title.replace(/(\r|\n|\t)/gm,"").trim();       
                writer = $(this).find('td').eq(2).text(), json.writer = writer.replace(/(\r|\n|\t)/gm,"").trim();
                date = $(this).find('td').eq(3).text(), json.date = date.replace(/(\r|\n|\t)/gm,"").trim();
                hits = $(this).find('td').eq(4).text(), json.hits = hits.replace(/(\r|\n|\t)/gm,"").trim();
                file = $(this).find('td').eq(5).text(), json.file = file.replace(/(\r|\n|\t)/gm,"").trim();
                array_json.push(json);
            })
        }
    
        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('testoutput.json', JSON.stringify(array_json, null, 6), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        });

        //파일 읽고 내용 로그
        fs.readFile('./testoutput.json', 'utf8', function (err, data) {
            Observer.count({}, function(err,count){
                if(count == 0){
                    var first = new Observer(
                    {no : 0});
                    first.save(function(err, doc){
                        if(!err){
                            console.log("Observer 초기화 완료");

                         }
                    });
                }
            })    


            Observer.findOne({}, function(err, doc){
                var Stop = new Error('Stop');
                var new_count = 0;
                ob_value = doc.latest_no;                
                
                    obj = JSON.parse(data);
                    obj.forEach(function(output){
                        if(output.no > ob_value){                            
                            ox = true ;
                            push_title = output.title;
                            console.log("현재 새글이 존재합니다:" + output.no);
                            doc.latest_no = output.no;
                            doc.save(function(err, doc){
                                if(!err){
                                    console.log("Observer 값 수정완료.");                                    
                                }
                            })
                            new_count++;
                        }else{
                            ox = false;
                        }                       
                    })                
                if(new_count == 0) console.log("현재 새로업데이트 된 글이 없습니다.");
            })          
        });
    });
    
    if(ox == true){
        push_message(push_title);
    }
}

setInterval( output_check, 5500 );
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.

//push_message();
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;