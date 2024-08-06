const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send('Acesso negado. Privilégios insuficientes.');
  }
  next();
};

module.exports = adminMiddleware;
