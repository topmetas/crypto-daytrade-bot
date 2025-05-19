const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const gerarToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

async function registrar(req, res) {
  const { email, senha } = req.body;

  try {
    const hash = await bcrypt.hash(senha, 10);
    const novoUsuario = await User.create({ email, senha: hash });
    const token = gerarToken(novoUsuario._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no registro', detalhe: err.message });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = gerarToken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhe: err.message });
  }
}

module.exports = { registrar, login };
