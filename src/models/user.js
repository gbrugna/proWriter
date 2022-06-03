const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: String,
    password: String,
    username: String,
    average_wpm: Number,
    races_count: Number,
    precision: Number
}, {strict: false}));