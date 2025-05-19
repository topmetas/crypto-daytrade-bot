const { comprar, vender, listarOrdens, historicoOrdens } = require('../services/binanceService');
const { notificarTelegram } = require('../services/telegramService');

/**
 * Handler para realizar compra via Binance.
 */
async function comprarHandler(req, res) {
  const { symbol, quantidade } = req.body;
  try {
    const resultado = await comprar(symbol, quantidade);

    await notificarTelegram(`📈 Ordem de COMPRA executada:\n📌 Symbol: ${symbol}\n💰 Quantidade: ${quantidade}`);

    res.json({ sucesso: true, resultado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao comprar', detalhe: err.message });
  }
}

/**
 * Handler para realizar venda via Binance.
 */
async function venderHandler(req, res) {
  const { symbol, quantidade } = req.body;
  try {
    const resultado = await vender(symbol, quantidade);

    await notificarTelegram(`📉 Ordem de VENDA executada:\n📌 Symbol: ${symbol}\n💰 Quantidade: ${quantidade}`);

    res.json({ sucesso: true, resultado });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao vender', detalhe: err.message });
  }
}

/**
 * Handler para listar ordens abertas.
 */
async function listarOrdensHandler(req, res) {
  const { symbol } = req.query;
  try {
    const ordens = await listarOrdens(symbol);
    res.json(ordens);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar ordens', detalhe: err.message });
  }
}

/**
 * Handler para obter histórico de ordens.
 */
async function historicoOrdensHandler(req, res) {
  const { symbol } = req.query;
  try {
    const historico = await historicoOrdens(symbol);
    res.json(historico);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar histórico', detalhe: err.message });
  }
}

module.exports = {
  comprarHandler,
  venderHandler,
  listarOrdensHandler,
  historicoOrdensHandler
};


