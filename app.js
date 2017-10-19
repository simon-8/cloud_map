let Koa = require('koa');
let bodyParser = require('koa-bodyparser');
let http = require('http');

let controller = require('./controller');
let template = require('./template');
let staticFiles = require('./static-files');

let app = new Koa();

app.use(bodyParser());

// 排除 favicon.ico
app.use(async (ctx, next) => {
    if (ctx.request.url.indexOf('/favicon.ico') > -1) return false;
    console.log(`${ctx.request.method} ===> ${ctx.request.url}`);
    await next();
});

app.use(template());
app.use(controller());

app.use(staticFiles('/skin/', __dirname + '/skin'));
app.listen(3000);

http.get('http://localhost:3000/spider/init/10', function(res) {
    console.log('启动抓取');
});
console.log('server is running port: 3000');