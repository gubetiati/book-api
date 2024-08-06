const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Acesso negado. Token não fornecido.');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Token inválido.');
  }
};

module.exports = authMiddleware;
