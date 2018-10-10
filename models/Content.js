var mongoose = require('mongoose')
var usersSchema = require('../schemas/content')

module.exports = mongoose.model('Content',usersSchema)