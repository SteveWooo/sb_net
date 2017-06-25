window.detail = [];

// var canvasInit = function(){
// 	window.canvas = document.getElementById('canvas');
// 	window.ctx = canvas.getContext('2d');
// }

// var clear = function(){
// 	ctx.fillStyle = "#fff";
// 	ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

var createCanvas = function(id){
	var title = document.createElement('h2');
	title.innerHTML = id + " : ";
	var can = document.createElement('canvas');
	can.id = "canvas_" + id;
	can.width = "1000";
	can.height = "100";

	document.getElementById('content').appendChild(title);
	document.getElementById('content').appendChild(can);

	return can;
}

var getCan = function(id){
	var c = document.getElementById('canvas_' + id);
	return c.getContext('2d');
}

var setPoint = function(obj, can){
	// clear();
	var ctx = can.getContext('2d');
	var d = obj.data;
	var x = 50,y;
	for(var i=0;i<d.length;i++){
		y = parseFloat(d[i].count);
		ctx.fillStyle = "#000";
		ctx.fillRect(x, 100-y*2, 2, 2);
		x += 2;
	}

	ctx.font="10px Georgia";
	ctx.fillText("50",0, 10);
	ctx.fillText("0", 0, can.height);
}

var entry = function(){
	for(var i=0;i<detail.length;i++){
		var can = createCanvas(detail[i].room);
		setPoint(detail[i], can);
	}
}

!function init(){
	// canvasInit();
	var data = document.getElementById('data').innerHTML;
	data = data.split('\n');
	for(var i=0;i<data.length;i++){
		var roomName = data[i].substring(0, data[i].indexOf('--'));
		var temp = data[i].substring(data[i].indexOf('--') + 2);

		temp = temp.split('`');

		var det = [];

		for(var k=0;k<temp.length;k++){
			var d = temp[k].split(':');
			var o = {
				date : d[0],
				count : d[1]
			}

			det.push(o);
		}

		var obj = {
			room : roomName,
			data : det
		}

		detail.push(obj)
	}

	console.log(detail);

	entry();
}()

