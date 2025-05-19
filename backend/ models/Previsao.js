const mongoose = require('mongoose');

const PrevisaoSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  tendencia: { type: String, enum: ['alta', 'baixa'], required: true },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Previsao', PrevisaoSchema);
