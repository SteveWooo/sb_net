var fs = require('fs'),
	nodex = require('node-xlsx');

function getResult (data, room){
	var result = "";
	room = room.substring(0, room.indexOf('.xls'));
	for(var i=1;i<data.length-1;i++){
		var date = data[i][5].substring(0, 10);
		var count  = data[i][3];
		result += date + ":" + count + "`";
	}

	result = result.substring(0, result.length - 1);
	result = "room" + room + "--" +result + "\n";

	return result ;
}

var writeFile = function(data, callback){
	fs.appendFile(__dirname + "/result", data, callback);
}

var getFile = function(files, num, callback){
	if(num >= files.length){
		callback({code : 200});
		return ;
	}
	var obj = nodex.parse(__dirname + '/data/' + files[num]);
	var excelObj=obj[0].data;
	var result = getResult(excelObj, files[num]);
	writeFile(result, function(){
		getFile(files, num+1, callback);
	});
}

var main = function(callback){
	var files = fs.readdirSync('./data');
	getFile(files, 3, callback);
}

main((data)=>{
	console.log(data);
})