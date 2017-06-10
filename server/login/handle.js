let crypto = require('crypto'),
    conf = require('../../conf/config');

//检查密码正确
let check = (rows, req)=>{
    var inputMd5 = crypto.createHash('md5').update(req.query.passwd + conf.salt).digest('hex');
    console.log(inputMd5);
    if(rows.length !== 1){
        console.log("query data length 0");
        return false;
    }

    return rows[0].passwd == inputMd5;
}

let getUser = (req, callback)=>{
    if(!req.query.account){
        callback(undefined);
        return ;
    }
    let sql = "SELECT * FROM `admin` WHERE `account`=" + req.query.account;
    req.mysqlPool.query(sql, (err, rows, field)=>{
        callback(check(rows, req));
    })
}

let handle = (req, res, next)=>{
    getUser(req, (rows)=>{
        console.log(rows);
        res.result = {
          rows : rows
        }
        next();
    })
}

exports.handle = handle;
