var request = require('request'),
	nodex = require('node-xlsx'),
	excel = require('excel-parser'),
	fs = require('fs');

function downloadFile(option, filename, callback){
    var stream = fs.createWriteStream(filename);
    request.post(option).pipe(stream).on('close', callback); 
}

var headers = {
	"Cookie" : "pgv_pvi=6289565696; iPlanetDirectoryPro=AQIC5wM2LY4SfcxMOa9BwfCjpmd62yCZl%2FUdpPJPym8qqfo%3D%40AAJTSQACMDE%3D%23; JSESSIONID=78A7AF58AF3325FBCEA8BA430047B305",
	"Host" : "dfcx.nfu.edu.cn",
	"Origin" : "http://dfcx.nfu.edu.cn",
	"Referer" : "http://dfcx.nfu.edu.cn/webSelect/usedQuantityDelEleView.do?method=findUsedQuantityDelEleView",
}

var readXls = function(name, callback){
	var obj = nodex.parse(__dirname + '/data/' + name + '.xls');
	var excelObj=obj[0].data;
	console.log("download : " + name);
	callback();
}

var changeRoom = function(req, callback){
	var option = {
		url : "http://dfcx.nfu.edu.cn/webSelect/roomFillLogView.do?method=webSelectLogin",
		headers : {
			"Cookie" : "JSESSIONID=78A7AF58AF3325FBCEA8BA430047B305",
			"Host" : "dfcx.nfu.edu.cn",
			"Origin" : "http://dfcx.nfu.edu.cn",
			"Referer" : "http://dfcx.nfu.edu.cn/",
			"Content-Type" : "application/x-www-form-urlencoded",
			"Accept-Encoding" : "gzip, deflate",
			"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
 			'User-Agent' : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13E238 MicroMessenger/6.5.3 NetType/WIFI Language/zh_CN'
		},
		form : {
			'buildingId' : 8,
			'roomName' : req.room,
			'adminRand' : req.rand,
			'x' : req.x,
			'y' : req.y
		}
	}

	request.post(option, function(err, res, body){
		if(err || res.statusCode !== 302){
			console.log("faile : " + req.room);
			callback("faile");
			return ;
		}
		callback();
	})
}

var download = function(name, callback){
	var option = {
		headers : headers,
		form : {
			"ec_eti" : 'ec',
			"ec_ev" : 'xls',
			"ec_efn" : 'UsedEle.xls',
			"ec_crd" : '10',
			"ec_p" : '3',
			"beginTime" : '2016-09-1',
			"endTime" : '2017-06-25',
			"method" : 'findUsedQuantityDelEleView'
		},
		url : "http://dfcx.nfu.edu.cn/webSelect/usedQuantityDelEleView.do?method=findUsedQuantityDelEleView"
	}

	downloadFile(option, __dirname + '/data/' + name + '.xls', function(){
		callback();
	})
}

var changeReq = {
	room : "104",
	rand : 9446
}

function entry(req){
	var floor = parseInt(req.room.substring(0, 1));
	var num = parseInt(req.room.substring(1));
	if(floor > 5){
		console.log('finished');
		return ;
	}
	//换楼层
	if(num > 33) {
		req.room = (floor + 1) + "01";
		entry(req);
		return ;
	}

	changeRoom(changeReq, function(res){
		download(changeReq.room, function(){
			readXls(changeReq.room, function(){
				floor = floor + "";
				num = num < 9 ? "0" + (num+1) : (num+1);
				req.room = floor + num;
				entry(req);
			});
		})
	})
}

entry(changeReq);

// readXls(function(){});
// download(function(){});

// readXls ((result)=>{
// 	if(typeof result === "string"){
// 		console.log("faile : " + result);
// 		return ;
// 	}

// 	console.log(result);
// })