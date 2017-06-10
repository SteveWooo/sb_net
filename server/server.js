let express = require('express'),
    app = express(),
    conf = require('../conf/config'),
    login = require('./login/handle').handle,
    work = require('./work/handle').handle,

    mysql = require('mysql');

let getPool = ()=>{
  var pool = mysql.createPool(conf.mysql);
  return pool;
}

let begin = (req, res, next)=>{
    req.mysqlPool = getPool();
    next();
}

let end = (req, res)=>{
    req.mysqlPool.end();
    res.send(res.result);
}

let init = ()=>{
    var port = conf.serverPort || 5555; //defalt port 5555
    app.use(express.static("./public"));

    app.get("/login", [begin, login, end]);

    // 开始监听端口
    return app.listen(port, function () {
        console.log('listening on port', port);
    });
}

exports.init = init;
