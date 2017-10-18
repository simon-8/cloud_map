let fs = require('fs');
let router = require('koa-router')();

// 添加控制器
function addControllers() {
    let files = fs.readdirSync(__dirname + '/controllers/');
    let controllers = files.filter(function(file) {
        return file.endsWith('.js');
    });
    
    for (let controller of controllers) {
        let funcs = require(__dirname + '/controllers/' + controller);
        addRouter( funcs);
    }
}

// 注册路由
function addRouter(funcs) {
    for (let url in funcs) {
        if (url.startsWith('GET ')) {
            let path = url.substr(4);
            router.get(path, funcs[url]);
        } else if (url.startsWith('POST ')) {
            let path = url.substr(5);
            router.post(path, funcs[url]);
        } else {
            console.log('无效URL');
        }
    }
}

function controller(dir) {
    let controller_dir = dir || 'controllers';
    addControllers(router);
    return router.routes();
}

module.exports = controller;