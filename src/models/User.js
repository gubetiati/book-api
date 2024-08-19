const mongoose = require('mongoose')

//criação do modelo Usuário no MongoDB
const user = new mongoose.Schema({
    nome: String,
    email: {type: String, unique: true},
    senha: String,
    isAdmin: {type: Boolean, default: false},
    livrosLidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
})

const User = mongoose.model('User', user)

module.exports = User