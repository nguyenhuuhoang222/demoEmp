const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
name: String,
email: String,
phone: String,
pwd: String,
role: String
});    


module.exports = mongoose.model('emps', empSchema);