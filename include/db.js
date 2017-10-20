let mongoose = require('mongoose');

// mongoose.connection.openUri('mongodb://localhost:27017/');
mongoose.connect('mongodb://localhost:27017/test', {useMongoClient: true});

mongoose.connection.on('connected', function() {
    console.log('MongoDB is connected!');
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose Error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('MongoDB is disconnected!');
});
mongoose.Promise = global.Promise;
module.exports = mongoose;