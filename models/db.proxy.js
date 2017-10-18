var mongoose = require('../db');
var Schema = mongoose.Schema;

var proxySchema = new Schema({
    linkurl: {type: String},
    title: {type: String}
});

module.exports = mongoose.model('Proxy', proxySchema);