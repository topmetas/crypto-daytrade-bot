const Binance = require('node-binance-api');
const Ordem = require('../models/Ordem');
require('dotenv').config();

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

/**
 * Calcula o valor total da operação com base no bidPrice atual.
 */
async function calcularValor(symbol, quantidade) {
  try {
    const { bidPrice } = await binance.bookTicker(symbol);
    return parseFloat(bidPrice) * quantidade;
  } catch (error) {
    console.error(`Erro ao calcular valor de ${symbol}:`, error.body || error);
    throw error;
  }
}

/**
 * Verifica se a ordem excede o limite de risco.
 */
async function verificarLimiteRisco(symbol, quantidade) {
  const limite = parseFloat(process.env.RISK_LIMIT || '0');
  if (isNaN(limite) || limite <= 0) {
    throw new Error('Limite de risco inválido ou não definido no .env (RISK_LIMIT).');
  }

  const valorTotal = await calcularValor(symbol, quantidade);
  if (valorTotal > limite) {
    throw new Error(`Ordem excede o limite de risco (${limite} USDT). Valor estimado: ${valorTotal.toFixed(2)} USDT.`);
  }
}

/**
 * Registra uma ordem no banco e calcula lucro se for venda.
 */
async function registrarOrdem(tipo, symbol, quantidade, preco) {
  const novaOrdem = new Ordem({ tipo, symbol, quantidade, preco });

  if (tipo === 'venda') {
    const ultimaCompra = await Ordem.findOne({
      tipo: 'compra',
      symbol,
      lucro: null,
    }).sort({ data: 1 });

    if (ultimaCompra) {
      const lucro = (preco - ultimaCompra.preco) * quantidade;
      ultimaCompra.lucro = lucro;
      await ultimaCompra.save();
      novaOrdem.lucro = lucro;
    }
  }

  await novaOrdem.save();
  return novaOrdem;
}

/**
 * Realiza uma compra a mercado na Binance.
 */
async function comprar(symbol = 'BTCUSDT', quantidade = 0.001) {
  try {
    await verificarLimiteRisco(symbol, quantidade);
    const order = await binance.marketBuy(symbol, quantidade);
    const preco = parseFloat(order.fills?.[0]?.price || 0);
    await registrarOrdem('compra', symbol, quantidade, preco);
    return order;
  } catch (error) {
    console.error(`Erro ao comprar ${symbol}:`, error.body || error);
    throw error;
  }
}

/**
 * Realiza uma venda a mercado na Binance.
 */
async function vender(symbol = 'BTCUSDT', quantidade = 0.001) {
  try {
    await verificarLimiteRisco(symbol, quantidade);
    const order = await binance.marketSell(symbol, quantidade);
    const preco = parseFloat(order.fills?.[0]?.price || 0);
    await registrarOrdem('venda', symbol, quantidade, preco);
    return order;
  } catch (error) {
    console.error(`Erro ao vender ${symbol}:`, error.body || error);
    throw error;
  }
}

/**
 * Lista ordens abertas para um símbolo.
 */
async function listarOrdens(symbol) {
  try {
    return await binance.openOrders(symbol);
  } catch (error) {
    console.error(`Erro ao listar ordens para ${symbol}:`, error.body || error);
    throw error;
  }
}

/**
 * Retorna o histórico de ordens para um símbolo.
 */
async function historicoOrdens(symbol) {
  try {
    return await binance.orders(symbol);
  } catch (error) {
    console.error(`Erro ao obter histórico de ordens para ${symbol}:`, error.body || error);
    throw error;
  }
}

module.exports = {
  comprar,
  vender,
  listarOrdens,
  historicoOrdens,
  calcularValor,
};




