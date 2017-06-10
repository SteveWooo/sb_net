var conf = require('../conf/config'),
    cluster = require('cluster'),
    os = require('os'),
    server = null,
    port;

function start () {
    server = require('./server');
    console.info('starting server ..');

    var numCPUs = os.cpus().length,
        clusterCount = conf.clusterCount || numCPUs,
        maxClusterCount = numCPUs,
        worker = null;

    if (clusterCount <= 1) {
        worker = server.init();
    } else {
        if (cluster.isMaster) {
            // 创建服务器
            for (var i = 0; i < clusterCount; i++) {
                cluster.fork();
            }

            if(conf.mode != "DEV"){
              // 进程异常退出处理
              cluster.on('exit', function(worker, code, signal) {
                  var newCluster = cluster.fork();
                  console.info("crashed : " + new Date());
              });
            }
        } else {
            worker = server.init();
        }
    }
}

if (require.main === module) {
    // 启动服务器
    start();
}
