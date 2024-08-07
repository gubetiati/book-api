const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

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

// Rota para excluir um usuário não administrador
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

module.exports = router;
