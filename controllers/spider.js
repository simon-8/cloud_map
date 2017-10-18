let proxy = require('../proxy2');
let spider = require('../spider');

let House = require('../models/db.house');

// 初始化数据
let p_init = async (ctx, next) => {
    spider.setProxy(await proxy.getProxy());
    let list = await spider.getPageHtml();
    console.log(list);
    if (list) {
        let house;
        for (var obj of list) {
            house = new House(obj);
            house.save();
        }
    }
    ctx.response.body = '处理完成';
};

// 
let p_index = async (ctx, next) => {
    ctx.response.body = 'This is Spider Index Page';
};

// 返回数据
let p_getData = async (ctx, next) => {
    ctx.response.body = spider.getData();
};

let p_getPageData = async (ctx, next) => {
    let page = ctx.params.page ? parseInt(ctx.params.page) : 1;
    
};

module.exports = {
    'GET /spider/init': p_init,
    'GET /spider/': p_index,
    'GET /spider/getData': p_getData,
    'GET /spider/getPage/:page': p_getPageData 
};