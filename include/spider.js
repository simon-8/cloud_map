let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');
let async = require('async');
let House = require('../models/db.house');

let spider = {
    baseUrl: 'http://hz.58.com/xihuqu/chuzu/0/?minprice=1000_2000&PGTID=0d3090a7-0005-521c-9666-544119741a06&ClickID=2',
    proxy: [],
    cachePath: __dirname + '/../cache/',
    setProxy: function(data) {
        if (!data.length) {
            throw Error('代理列表不能为空');
        }
        this.proxy = data;
    },
    getProxy: function() {
        if (!this.proxy.length) {
            throw Error('代理列表为空, 无法继续操作');
        }
        let random = parseInt(Math.floor(Math.random() * this.proxy.length));
        if (this.proxy[random]) {
            return this.proxy[random];
        } else {
            throw Error('获取代理地址失败, random: ' + random);
        }
        return this.proxy;
    },
    getPageUrl: function(page = 1) {
        let pageUrl = 'http://hz.58.com/xihuqu/chuzu/0/'+( page > 1 ? '/pn' + page + '/' : '' )+'?minprice=1000_2000&PGTID=0d3090a7-0005-521c-9666-544119741a06&ClickID=2';//不限单间
        return pageUrl;
    },
    getPage: function(page) {
        for (let i = 1; i < page; i++) {
            this.getPageHtml(i);
        }
    },
    getPageHtml: function(page = 1) {
        let that = this;
        let pageUrl = this.getPageUrl(page);
        let options = {
            method: 'GET',
            url: pageUrl,
            // proxy: this.getProxy(),
            gzip: true,
            encoding: null,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
                'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'referer': this.baseUrl
            }
        };
        
        request(options, function(err, res, body){
            if (err) {
                throw Error(err.message);
            }
            let $ = cheerio.load(body);
            let urls = [];
            $('.des h2 a').each(function(){
                let url = $(this).attr('href').toString();
                if (url.length && url.indexOf('/zd_p/') == -1 && url.indexOf('/e.58.com/') == -1) {
                    urls.push(url);
                }
            });
            async.mapLimit(urls, 1, function(url, callback){
                console.log(`开始采集: ${url}`);
                setTimeout(function(){
                    that.getPageContent(url, callback);
                }, Math.random() * 5000);
            }, function(err, result) {
                console.log(`第${page}页 采集成功:` + result.length);
            });
        });
    },
    getPageContent: function(url, callback) {
        let options = {
            method: 'GET',
            url: url,
            // proxy: this.getProxy(),
            gzip: true,
            encoding: null,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
                'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'referer': this.baseUrl
            }
        };
        request(options, function(err, res, body) {
            if (err) {
                throw Error(err.message);
            }
            body = body.toString();
            let $ = cheerio.load(body);
            let data = {};
            data.title = $('.house-title .c_333.f20').text();
            if (data.title) {
                data.id = options.url.match(/\d{5,15}/);
                data.url = options.url;
                data.thumb = $('#smainPic').attr('src');
                data.price = $('.f36').text();
                data.area = $('.house-basic-desc .f14 li').eq(4).find('.c_888.mr_15+span').text().replace(/\s/g,"");
                data.xiaoqu = $('.house-basic-desc .f14 li').eq(3).find('.c_888.mr_15+span').text();
                data.style = $('.house-basic-desc .f14 li').eq(1).find('.c_888.mr_15+span').text().replace(/\s/g,"");
                data.paymentType = $('.house-pay-way .c_333').text();
                data.room = $('.house-basic-desc .f14 li').eq(0).find('.c_888.mr_15+span').text();
                // let house = new House(data);
                House.findOneAndUpdate({id: data.id}, data, {upsert: true}, function(err, doc, res){
                    if (doc) {
                        console.log(`更新完成: ${data.url}`);
                    } else {
                        console.log(`采集完成: ${data.url}`);
                    }
                    callback(null, data.url);
                });
            } else {
                console.log(`采集失败: 无法获取页面内容`);
                callback(null, data.url);
            }
        });
    },
    getData: async function() {

            let data = await House.find().limit(2);
            return data;

        // return fs.readFileSync(this.cachePath + 'data.json', 'utf-8');
    }
};

module.exports = spider;

// (async () => {
//     let proxy = require('./proxy');
//     spider.setProxy(proxy.getCache());
//     spider.getPageContent('http://short.58.com/zd_p/50b4c893-f73f-4fa7-addc-e88abb4bd4b7/?target=eh-16-xgk_ephv_87117838814104q-feykn&end=end', function(err, res) {
//         console.log('end');
//     });
// })();