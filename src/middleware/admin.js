//middleware para verificar se o usuário é administrador
const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send({ error: 'Acesso negado.' });
  }
  next();
};

module.exports = adminMiddleware;
