const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv')

dotenv.config()

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Middleware de autenticação iniciado');
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Token recebido:', token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Token decodificado:', decoded);
    const user = await User.findOne({ _id: decoded._id });
    console.log('Usuário encontrado:', user);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.log('Erro no middleware de autenticação:', err.message);
    res.status(401).send({ error: 'Por favor, autentique-se.' });
  }
};

module.exports = authMiddleware;
