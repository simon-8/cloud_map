let proxy = require('../include/proxy');

let p_index = async function(ctx, next) {
    proxy.getProxy();
    ctx.response.body = '开始采集';
};

let p_verify = async function(ctx, next) {
    console.log(ctx.ip);
    ctx.response.body = ctx.ip;
};

module.exports = {
    'GET /proxy/': p_index,
    'GET /proxy/verify': p_verify
};