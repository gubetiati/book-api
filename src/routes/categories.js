const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Listar categorias
router.get('/', async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

// Adicionar categoria (somente administrador)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.send(category);
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao criar categoria', error: err.message });
  }
});

// Atualizar categoria (somente administrador)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(category);
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao atualizar categoria', error: err.message });
  }
});

// Deletar categoria (somente administrador)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.send({ msg: 'Categoria deletada com sucesso' });
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao deletar categoria', error: err.message });
  }
});

module.exports = router;