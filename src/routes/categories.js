const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

//rota para listar categorias
router.get('/', async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Lista todas as categorias'
  const categories = await Category.find();
  res.send(categories);
});

//rota para adicionar categoria (somente administrador)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Adiciona uma nova categoria'
  // #swagger.description = 'Somente administradores podem adicionar'
  try {
    const category = new Category(req.body);
    await category.save();
    res.send(category);
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao criar categoria', error: err.message });
  }
});

//rota para atualizar categoria (somente administrador)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Atualiza uma categoria'
  // #swagger.description = 'Somente administradores podem atualizar'
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(category);
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao atualizar categoria', error: err.message });
  }
});

//rota para deletar categoria (somente administrador)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.summary = 'Deleta uma categoria'
  // #swagger.description = 'Somente administradores podem deletar'
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.send({ msg: 'Categoria deletada com sucesso' });
  } catch (err) {
    res.status(400).send({ msg: 'Erro ao deletar categoria', error: err.message });
  }
});

module.exports = router;