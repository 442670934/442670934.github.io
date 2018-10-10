var mongoose = require('mongoose')
var usersSchema = require('../schemas/category')

module.exports = mongoose.model('Category',usersSchema)