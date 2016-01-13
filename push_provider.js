
//output.json 을 읽어서 가장 최신의 자료를 푸시 해주는 서비스 프로바이더.
var fs = require('fs');
var gcm = require('node-gcm');

// var obj;
// var count=0;

//interval 내에서 지정 시간마다 콜백 함수를 실행한다.
//여기에 output.json을 확인하며 변경이 있을 경우 푸시를 보낸다.
//변경 조건은 어떻게 할까?
// var interval = setInterval(function(){

// 	fs.readFile('./output.json', 'utf8', function (err, data) {
// 	  if (err) throw err;
// 	  obj = JSON.parse(data);
// 	  obj.forEach(function(output){ 
// 	    console.log(output.title);
// 	  })
// 	});
// 	//5회 반복
// 	count++;
// 	if(count>5)
// 	{
// 		clearInterval(interval);
// 	}
// },5000)

//create a message with default values
//var message = new gcm.Message();

// or with object values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        key1: '안녕하세요.',
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