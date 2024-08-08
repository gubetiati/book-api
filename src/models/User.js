const mongoose = require('mongoose')

const user = new mongoose.Schema({
    nome: String,
    email: {type: String, unique: true},
    senha: String,
    isAdmin: {type: Boolean, default: false},
    livrosLidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
})

const User = mongoose.model('User', user)

module.exports = User