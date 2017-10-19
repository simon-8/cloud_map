var request = require('request');
var iconv = require('iconv-lite');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var proxy = {
    // 代理列表
    proxyList: [],
    // 待验证代理列表
    proxyVerifyList: [],
    // 缓存路径
    cachePath: __dirname + '/../cache/proxy.json',
    // 获取待验证代理列表
    getProxyVerifyList: function() {

        // if (this.proxyVerifyList.length == 0) {
        //     this.proxyVerifyList = this.getCache();
        //     if (this.proxyVerifyList.length) return true;
        // }

        let that = this;
        return new Promise(function(resolve, reject){
            let apiURL = 'http://www.xicidaili.com/wt/';
            let options = {
                method: 'GET',
                url: apiURL,
                gzip: true,
                encoding: null,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, sdch',
                    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                    'referer': 'http://www.xicidaili.com/'
                }
            };
            
            request(options, function(err, res, body) {
                if (err) {
                    reject(err);
                }
                if (/meta.*charset=gb2312/.test(body)) {
                    body = iconv.decode(body, 'gbk');
                }
                let $ = cheerio.load(body);
                $('#ip_list tr').each(function(i) {
                    if (i > 0) {
                        let ip = $(this).find('td').eq(1).html();
                        let port = $(this).find('td').eq(2).html();
                        that.proxyVerifyList.push({
                            ip: ip,
                            port: port
                        });
                    }
                });
                resolve(that.proxyVerifyList);
            });
        }).then(function(result){
            console.log('获取待校验列表成功! 数量: ' + that.proxyVerifyList.length);
            // return result;
        }).catch(function(result){
            console.log('获取待校验列表失败:' + result);
        });
    },
    // 获取代理地址
    getProxy: async function() {
        await this.getProxyVerifyList();
        if (!this.proxyVerifyList.length) {
            throw Error('代理列表为空, 无法继续操作');
        }
        // debug
        this.proxyVerifyList = this.proxyVerifyList.slice(0, 20);
        let that = this;

        async.mapLimit(this.proxyVerifyList, 10, function(proxy, callback){
            that.verifyProxy(proxy, callback);
        }, function(err, result){
            if (err) console.log('err: ' + err);
            for (let data of result) {
                if (data) {
                    that.proxyList.push(data);
                    that.saveCache();
                }
            }
            console.log('采集完成: ' + that.proxyList.length);
            process.exit();
        });
        return true;
    },
    // 校验代理地址
    verifyProxy: function(proxy, callback) {
        let that = this;
            let options = {
                method: 'GET',
                // url: 'http://localhost:3000/proxy/verify',
                url: 'https://simon8.com/test.php',
                timeout: 8000,
                encoding: null
            };

            options.proxy = `http://${proxy.ip}:${proxy.port}`;
            request(options, function(err, res, body) {
                try {
                    let ip = body.toString();
                    if (proxy.ip == ip) {
                        console.log(`验证成功 ==>> ${ip}`);
                        callback(null, options.proxy);
                    } else {
                        callback(null, null);
                    }
                } catch (e) {
                    // console.log(e.message);
                    callback(null, null);
                }
            });

    },
    getCache: function() {
        let cache = fs.readFileSync(this.cachePath, 'utf-8');
        return cache ? JSON.parse(cache) : [];
    },
    saveCache: function() {
        return fs.writeFileSync(this.cachePath, JSON.stringify(this.proxyList));
    },
    test: function() {
        
    },
};

module.exports = proxy;
// proxy.test();
// proxy.getCache();
// (async () => {
//     await proxy.getProxy();
// })();
