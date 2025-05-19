const mongoose = require('mongoose');

const ordemSchema = new mongoose.Schema({
  tipo: String, // 'compra' ou 'venda'
  symbol: String,
  quantidade: Number,
  preco: Number,
  lucro: Number, // calculado posteriormente
  roi: Number,   // Calculado posteriormente
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ordem', ordemSchema);

