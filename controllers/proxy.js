let proxy = require('../proxy2');

let p_index = async function(ctx, next) {
    ctx.response.body = 'this is index page';
};

let p_verify = async function(ctx, next) {
    console.log(ctx.ip);
    ctx.response.body = ctx.ip;
};

module.exports = {
    'GET /proxy/': p_index,
    'GET /proxy/verify': p_verify
};