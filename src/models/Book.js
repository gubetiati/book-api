const mongoose = require('mongoose');

const book = new mongoose.Schema({
    titulo: String,
    autor: String,
    ano: Number,
    descricao: String
})

const Book = mongoose.model('Book', book)

module.exports = Book