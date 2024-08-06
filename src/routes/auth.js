const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY

// Rota de cadastro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const user = new User({ nome, email, senha });
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email, senha });
    if (!user) {
      return res.status(400).send('Email ou senha inválidos.');
    }
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, SECRET_KEY);
    res.send({ token });
    console.log("Admin logado com sucesso")
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
