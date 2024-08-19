const mongoose = require('mongoose');

//criação do modelo Categorias no MongoDB
const categorySchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
