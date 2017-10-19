var mongoose = require('../include/db');
var Schema = mongoose.Schema;

var proxySchema = new Schema({
    ip: String,
    port: Number
});

module.exports = mongoose.model('Proxy', proxySchema);