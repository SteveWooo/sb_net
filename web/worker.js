var i = 0;
setInterval(()=>{
	postMessage(i++);
}, 1000)