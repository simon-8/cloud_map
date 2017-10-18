let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let spider = {
    baseUrl: 'http://hz.58.com/xihuqu/chuzu/0/?minprice=1000_2000&PGTID=0d3090a7-0005-521c-9666-544119741a06&ClickID=2',
    proxy: [],
    cachePath: __dirname + '/cache/',
    setProxy: function(data) {
        if (!data.length) {
            throw Error('代理列表不能为空');
        }
        this.proxy = data;
    },
    getProxy: function() {
        // if (!this.proxy.length) {
        //     throw Error('代理列表为空, 无法继续操作');
        // }
        // let random = parseInt(Math.floor(Math.random() * this.proxy.length));
        // if (this.proxy[random]) {
        //     return this.proxy[random];
        // } else {
        //     throw Error('获取代理地址失败, random: ' + random);
        // }
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
            proxy: this.getProxy(),
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
        console.log('代理地址: ' + options.proxy);
        return new Promise(function(resolve, reject) {
            request(options, function(err, res, body){
                if (err) {
                    reject(err);
                }
                let $ = cheerio.load(body);
                let list = [];
                $('.des h2 a').each(function(){
                    let title = $(this).text().toString().trim();
                    if (title.length) {
                        let url = $(this).attr('href').toString();
                        list.push({
                            linkurl: url,
                            title: title
                        });
                    }
                });
                fs.writeFileSync(that.cachePath + 'data.json', JSON.stringify(list));
                resolve(list);
            });
        }).then(function(result){
            return result;
        }).catch(function(result){
            console.log('采集失败: ' + result);
        });

    },
    getData: function() {
        return fs.readFileSync(this.cachePath + 'data.json', 'utf-8');
    }
};

module.exports = spider;