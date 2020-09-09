const mongoose = require('mongoose');
const {uri} = require('../keys/key');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(uri, {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log("Connected to MongoDB Atlas..."))
  .catch((err) => console.log(`Some error occured while connecting to MongoDB Atlas! ${err}`));

module.exports.User = require('./user');
module.exports.Messages = require('./messages');