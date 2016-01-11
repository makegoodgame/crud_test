var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

url = 'http://jw4.mju.ac.kr/user/indexSub.action?framePath=unknownboard&siteId=cs&dum=dum&boardId=28510945&page=1&command=list&SWIFT_SESSION_CHK=false';

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

fs.writeFile('output.json', JSON.stringify(array_json, null, 6), function(err){
    console.log('File successfully written! - Check your project directory for the output.json file');
})


// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
res.send('Check your console!')

    }) ;
})
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;