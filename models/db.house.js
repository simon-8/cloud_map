var mongoose = require('../include/db');
var Schema = mongoose.Schema;

var proxySchema = new Schema({
    id: String,
    title: String,
    url: String,
    thumb: String,
    price: Number,
    area: String,
    xiaoqu: String,
    style: String,
    paymentType: String,
    room: String,
    addtime: String
});

module.exports = mongoose.model('House', proxySchema);