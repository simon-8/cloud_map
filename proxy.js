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
    cachePath: __dirname + '/cache/proxy.json',
    // 获取待验证代理列表
    getProxyVerifyList: function() {

        if (this.proxyVerifyList.length == 0) {
            this.proxyVerifyList = this.getCache();
            if (this.proxyVerifyList.length) return true;
        }

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
                        that.proxyVerifyList.push(ip + ':' + port);                        
                    }
                });
                resolve(that.proxyVerifyList);
            });
        }).then(function(result){
            console.log('getProxyVerifyList is ok');
        }).catch(function(result){
            console.log('getProxyVerifyList is Catch: ');
            console.log(result);
        });
    },
    // 获取代理地址
    getProxy: async function() {
        await this.getProxyVerifyList();
        if (!this.proxyVerifyList.length) {
            throw Error('代理列表为空, 无法继续操作');
        }
        let random,proxy,data;
        while (!proxy) {
            random = parseInt(Math.floor(Math.random() * this.proxyVerifyList.length));
            data = this.proxyVerifyList[random];
            proxy = await this.verifyProxy(data);
            if (!proxy) {
                // 删除无效代理
                this.proxyVerifyList.splice(random,1);
                console.log('验证失败:' + data + ', 重新执行匹配');
            }
        }
        this.proxyList = this.proxyVerifyList;
        this.saveCache();
        return proxy;
    },
    // 校验代理地址
    verifyProxy: function(proxy) {
        let that = this;
        return new Promise(function(resolve, reject) {
            let options = {
                method: 'GET',
                url: 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json',
                timeout: 8000,
                encoding: null
            };

            options.proxy = `http://${proxy}`;
            request(options, function(err, res, body) {
                try {
                    body = body.toString();
                    let response = JSON.parse(body);
                    if (response.ret == 1) {
                        console.log(`验证成功 ==>> ${response.country} ${response.province} ${response.city}`);
                        resolve(options.proxy);
                    } else {
                        reject('验证失败');
                    }
                } catch (e) {
                    reject(e.message);
                }
            });

        }).then(function(result){
            // console.log('verifyProxy is ok');
            return result;
        }).catch(function(result){
            console.log('verifyProxy is Catch: ' + result);
        });
    },
    getCache: function() {
        let cache = fs.readFileSync(this.cachePath, 'utf-8');
        return cache ? JSON.parse(cache) : [];
    },
    saveCache: function() {
        fs.writeFile(this.cachePath, JSON.stringify(this.proxyList), function(err) {
            if (err) throw err;
        });
    },
    test: function() {
        
    },
};

module.exports = proxy;
// proxy.test();
// proxy.getCache();
// (async () => {
//     let a = await proxy.getProxy();
//     console.log(a);
// })();
