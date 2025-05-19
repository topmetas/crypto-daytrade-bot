const { comprar, vender } = require('../services/binanceService');
const { notificarTelegram } = require('../services/telegramService');
const Previsao = require('../models/Previsao');
const binance = require('node-binance-api')().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});
const { calcularMediaMovel } = require('../services/binanceService'); // se exportado de lá

async function executarIA(req, res) {
  try {
    const { symbol = 'BTCUSDT' } = req.body;
    const quantidade = 0.001;

    // Obtem candles de 1 hora (últimos 20)
    const precos = await binance.futuresCandles(symbol, '1h', { limit: 20 });

    const precosFechamento = precos.map(candle => parseFloat(candle.close));
    const mediaMovel = calcularMediaMovel(precosFechamento);
    const ultimaMediaMovel = mediaMovel[mediaMovel.length - 1];
    const ultimoPreco = parseFloat(precos[precos.length - 1].close);

    // Simular previsão com base em média móvel
    const previsao = ultimoPreco > ultimaMediaMovel ? 'alta' : 'baixa';

    // Salvar no banco
    const novaPrevisao = await Previsao.create({
      symbol,
      tendencia: previsao,
      data: new Date()
    });

    // Executar ordem
    let resultado;
    if (previsao === 'alta') {
      resultado = await comprar(symbol, quantidade);
    } else {
      resultado = await vender(symbol, quantidade);
    }

    // Notificar via Telegram
    await notificarTelegram(`🤖 Previsão IA: ${previsao.toUpperCase()} para ${symbol}\n💰 Ordem executada com ${quantidade}`);

    // Resposta
    res.json({ sucesso: true, previsao, ordem: resultado });

  } catch (err) {
    console.error('Erro na IA:', err);
    res.status(500).json({ erro: 'Erro na execução da IA', detalhe: err.message });
  }
}

