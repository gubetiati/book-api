const mongoose = require('mongoose')

const user = new mongoose.Schema({
    nome: String,
    email: {type: String, unique: true},
    senha: String,
    isAdmin: {type: Boolean, default: false}
})

const User = mongoose.model('User', user)

module.exports = User