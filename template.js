// 初始化模板 并绑定到ctx参数
var nunjucks = require('nunjucks');

function template(path, opt) {
    let options = {
        autoescape: true,
        noCache: true,
        watch: true
    };
    if (typeof opt === 'object' && opt.length) {
        for(let idx in opt) {
            options[idx] = opt[idx];
        }
    }
    nunjucks.configure(path || 'template', options);

    return async (ctx, next) => {
        ctx.render = function(view, data) {
            ctx.response.body = nunjucks.render(view, data);
            ctx.response.type = 'text/html';
        };
        await next();
    }
};

module.exports = template;