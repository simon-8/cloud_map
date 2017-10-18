let p_index = async (ctx, next) => {
        ctx.render('map.html', {name: 'simon'});
};

module.exports = {
    'GET /': p_index
};