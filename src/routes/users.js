const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const Book = require('../models/Book')

const router = express.Router();

// Listar usuários cadastrados
router.get('/', async (req, res) => {
  const users = await User.find()
  res.send(users)
})

// Rota para criar um novo administrador
router.post('/admin', authMiddleware, adminMiddleware, async (req, res) => {
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

// Rota para excluir um usuário
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }
    if (user.isAdmin) {
      return res.status(400).send('Não é possível excluir um administrador.');
    }

    // Excluir o usuário
    await user.deleteOne();
    res.send('Usuário excluído com sucesso.');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Rota para alterar dados pessoais do usuário
router.put('/me', authMiddleware, async (req, res) => {
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

// Marcar livro como lido
router.post('/me/livrosLidos/:bookId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.bookId;

    // Verifica se o livro existe
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).send({ error: 'Livro não encontrado.' });
    }

    // Verifica se o livro já foi marcado como lido
    if (user.livrosLidos.includes(bookId)) {
      return res.status(400).send({ error: 'Este livro já está marcado como lido.' });
    }

    // Adiciona o livro à lista de livros lidos
    user.livrosLidos.push(bookId);
    await user.save();

    res.send({ message: 'Livro marcado como lido com sucesso.', livrosLidos: user.livrosLidos });
  } catch (err) {
    res.status(500).send({ error: 'Erro ao marcar livro como lido.', details: err.message });
  }
});

// Listar livros lidos pelo usuário
router.get('/me/livrosLidos', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'livrosLidos',
        populate: {
          path: 'categorias',
          select: 'nome' // Popula apenas o campo "nome" das categorias
        }
      });

    // Formata os dados para incluir apenas o nome das categorias
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


module.exports = router;
