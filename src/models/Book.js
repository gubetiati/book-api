const mongoose = require('mongoose');

//criação do modelo de livros no MongoDB
const book = new mongoose.Schema({
    titulo: String,
    autor: String,
    ano: Number,
    descricao: String,
    categorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
})

const Book = mongoose.model('Book', book)

module.exports = Book