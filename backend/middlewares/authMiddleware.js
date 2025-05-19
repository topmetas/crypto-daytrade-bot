const jwt = require('jsonwebtoken');

function proteger(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
}

module.exports = { proteger };
