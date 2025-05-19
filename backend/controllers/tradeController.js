const { obterTendencia } = require('../services/aiService');

const Trend = require('../models/Trend');

async function historicoTendencias(req, res) {
  try {
    const historico = await Trend.find().sort({ data: -1 }).limit(10);
    res.json(historico);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar histórico', detalhe: err });
  }
}


async function previsaoTendencia(req, res) {
  try {
    const resultado = await obterTendencia();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao prever tendência', detalhe: error });
  }
}

module.exports = { previsaoTendencia };
