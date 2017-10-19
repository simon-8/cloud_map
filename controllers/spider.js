let proxy = require('../include/proxy');
let spider = require('../include/spider');

let House = require('../models/db.house');

// 初始化数据
let p_init = async (ctx, next) => {
    spider.setProxy(proxy.getCache());
    await spider.getPage(ctx.params.number || 10);
    ctx.response.body = '处理完成';
};

// 
let p_index = async (ctx, next) => {
    ctx.response.body = 'This is Spider Index Page';
};

// 返回数据
let p_getData = async (ctx, next) => {
    ctx.response.body = await spider.getData();
};

// let p_getPageData = async (ctx, next) => {
//     let page = ctx.params.page ? parseInt(ctx.params.page) : 1;
    
// };

module.exports = {
    'GET /spider/init/:number': p_init,
    'GET /spider/': p_index,
    'GET /spider/getData': p_getData,
    // 'GET /spider/getPage/:number': p_getPageData 
};