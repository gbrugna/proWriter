const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Text', new Schema({
    content: String
}));