const { comprar, vender } = require('../services/binanceService');
const { notificarTelegram } = require('../services/telegramService');
const Previsao = require('../models/Previsao');

async function executarIA(req, res) {
  try {
    const { symbol = 'BTCUSDT' } = req.body;

    // Simular previsão
    const previsao = Math.random() > 0.5 ? 'alta' : 'baixa';
    const quantidade = 0.001; // Exemplo fixo

    const novaPrevisao = await Previsao.create({
      symbol,
      tendencia: previsao,
      data: new Date()
    });

    let resultado = null;
    if (previsao === 'alta') {
      resultado = await comprar(symbol, quantidade);
    } else {
      resultado = await vender(symbol, quantidade);
    }

    await notificarTelegram(`🤖 Previsão IA: ${previsao.toUpperCase()}\nOrdem executada para ${symbol} com ${quantidade}`);

    res.json({ sucesso: true, previsao, ordem: resultado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro na execução da IA', detalhe: err.message });
  }
}
