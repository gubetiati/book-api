const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book')

const router = express.Router();

//rota para listar usuários cadastrados
router.get('/', async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Lista usuários cadastrados'
  const users = await User.find()
  res.send(users)
})

//rota para criar um novo administrador
router.post('/admin', authMiddleware, adminMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Cria um novo administrador'
  // #swagger.description = 'Somente administradores podem criar'
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }
    user.isAdmin = true;
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//rota para excluir um usuário
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Deleta um usuário'
  // #swagger.description = 'Somente administradores podem deletar'
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }
    if (user.isAdmin) {
      return res.status(400).send('Não é possível excluir um administrador.');
    }

    //excluir o usuário
    await user.deleteOne();
    res.send('Usuário excluído com sucesso.');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//rota para alterar dados pessoais do usuário
router.put('/me', authMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Altera dados pessoas do usuários'
  try {
    const user = await User.findById(req.user._id);
    const { nome, email, senha } = req.body;
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) user.senha = senha;
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//rota para marcar livro como lido
router.post('/me/livrosLidos/:bookId', authMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Marca livro como lido'
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;

    // Verifica se o livro existe
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ error: 'Livro não encontrado.' });
    }

    //verifica se o livro já foi marcado como lido
    if (user.livrosLidos.includes(bookId)) {
      return res.status(400).send({ error: 'Este livro já está marcado como lido.' });
    }

    //adiciona o livro à lista de livros lidos
    user.livrosLidos.push(bookId);
    await user.save();

    res.send({ message: 'Livro marcado como lido com sucesso.', livrosLidos: user.livrosLidos });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao marcar livro como lido.', details: err.message });
  }
});

//rota para listar livros lidos pelo usuário
router.get('/me/livrosLidos', authMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Lista livros lidos pelo usuário'
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'livrosLidos',
        populate: {
          path: 'categorias',
          select: 'nome' //popula apenas o campo "nome" das categorias
        }
      });

    //formata os dados para incluir apenas o nome das categorias
    const livrosLidosComCategorias = user.livrosLidos.map(livro => ({
      _id: livro._id,
      titulo: livro.titulo,
      autor: livro.autor,
      ano: livro.ano,
      descricao: livro.descricao,
      categorias: livro.categorias.map(categoria => categoria.nome) // Extrai os nomes das categorias
    }));

    res.send(livrosLidosComCategorias);
  } catch (err) {
    res.status(500).send({ error: 'Erro ao listar livros lidos.', details: err.message });
  }
});

router.get('/me/recommendations', authMiddleware, async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Lista livros recomendados para o usuário'
  // #swagger.description = 'É listado livros recomendados conforme o que o usuário já leu.'
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'livrosLidos',
      populate: { path: 'categorias', select: 'nome' }
    });

    //coletar IDs das categorias dos livros que o usuário já leu
    const categoriasLidas = user.livrosLidos.reduce((acc, livro) => {
      livro.categorias.forEach(categoria => acc.add(categoria._id.toString()));
      return acc;
    }, new Set());

    //buscar livros que pertencem às categorias que o usuário leu, mas que ele ainda não leu
    const livrosRecomendados = await Book.find({
      categorias: { $in: Array.from(categoriasLidas) },
      _id: { $nin: user.livrosLidos }
    }).populate('categorias', 'nome');

    res.send(livrosRecomendados);
    console.log('_id do usuario: ' + req.user._id)
  } catch (err) {
    res.status(500).send({ error: 'Erro ao gerar recomendações.', details: err.message });
  }
});

module.exports = router;
