// ==================== IMPORTAÇÕES ====================
const Binance = require('node-binance-api');
const Ordem = require('../models/Ordem');
const coinbase = require('../services/coinbaseService'); // Módulo simulado de integração com a Coinbase
require('dotenv').config();

// ==================== CONFIGURAÇÃO DA BINANCE ====================
const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

// ==================== MÉTRICAS DE DESEMPENHO ====================
let ordensExecutadas = 0;
let ordensLucrativas = 0;
let lucroTotal = 0;
let saldoMaximo = 0;
let drawdownMaximo = 0;

// ==================== CONTROLE DE RISCO ====================
let perdaDiariaMaxima = 100; // Limite de perda diária em USDT
let perdaDiariaAtual = 0;

// ==================== CACHE DE PREÇO ====================
let cachePreco = {};

// ==================== FUNÇÕES DE MÉTRICA ====================
function atualizarMetricas(ordem) {
  ordensExecutadas++;
  if (ordem.lucro > 0) ordensLucrativas++;
  lucroTotal += ordem.lucro || 0;

  saldoMaximo = Math.max(saldoMaximo, lucroTotal);
  drawdownMaximo = Math.min(drawdownMaximo, lucroTotal - saldoMaximo);

  // Atualiza perda diária
  perdaDiariaAtual += ordem.lucro < 0 ? Math.abs(ordem.lucro) : 0;
}

function calcularTaxaDeSucesso() {
  if (ordensExecutadas === 0) return 0;
  return (ordensLucrativas / ordensExecutadas) * 100;
}

function exibirLucroTotal() {
  return lucroTotal;
}

function exibirDrawdownMaximo() {
  return drawdownMaximo;
}

function verificarLimitePerda() {
  if (perdaDiariaAtual >= perdaDiariaMaxima) {
    console.log("Limite de perda diário atingido. Pausando operações.");
    return true;
  }
  return false;
}

// ==================== UTILITÁRIAS ====================
async function getPreco(symbol) {
  if (cachePreco[symbol] && Date.now() - cachePreco[symbol].timestamp < 60000) {
    return cachePreco[symbol].preco;
  }

  const preco = await binance.getPrice(symbol);
  cachePreco[symbol] = { preco, timestamp: Date.now() };
  return preco;
}

async function calcularValor(symbol, quantidade) {
  const { bidPrice } = await binance.bookTicker(symbol);
  return parseFloat(bidPrice) * quantidade;
}

async function verificarLimiteRisco(symbol, quantidade) {
  const limite = parseFloat(process.env.RISK_LIMIT || '0');
  const valorTotal = await calcularValor(symbol, quantidade);
  if (valorTotal > limite) {
    throw new Error(`Limite de risco excedido (${valorTotal.toFixed(2)} > ${limite})`);
  }
}

// ==================== REGISTRO DE ORDEM ====================
async function registrarOrdem(tipo, symbol, quantidade, preco) {
  const novaOrdem = new Ordem({ tipo, symbol, quantidade, preco });

  if (tipo === 'venda') {
    const ultimaCompra = await Ordem.findOne({ tipo: 'compra', symbol, lucro: null }).sort({ data: 1 });
    if (ultimaCompra) {
      const lucro = (preco - ultimaCompra.preco) * quantidade;
      const roi = (lucro / (ultimaCompra.preco * quantidade)) * 100;

      ultimaCompra.lucro = lucro;
      ultimaCompra.roi = roi;
      await ultimaCompra.save();

      novaOrdem.lucro = lucro;
      novaOrdem.roi = roi;

      atualizarMetricas(novaOrdem);
    }
  }

  await novaOrdem.save();
  return novaOrdem;
}

// ==================== STOP LOSS / TAKE PROFIT ====================
async function definirStopLossTakeProfit(symbol, quantidade, precoEntrada) {
  const stopLossPercent = 0.02;
  const takeProfitPercent = 0.05;

  const stopLossPreco = parseFloat((precoEntrada * (1 - stopLossPercent)).toFixed(2));
  const takeProfitPreco = parseFloat((precoEntrada * (1 + takeProfitPercent)).toFixed(2));

  await binance.futuresOrder('SELL', symbol, quantidade, null, {
    stopPrice: stopLossPreco,
    price: stopLossPreco,
    reduceOnly: true,
    type: 'STOP_MARKET',
  });

  await binance.futuresOrder('SELL', symbol, quantidade, null, {
    stopPrice: takeProfitPreco,
    price: takeProfitPreco,
    reduceOnly: true,
    type: 'TAKE_PROFIT_MARKET',
  });
}

// ==================== OPERAÇÕES DE MERCADO ====================
async function comprar(symbol = 'BTCUSDT', quantidade = 0.001) {
  if (verificarLimitePerda()) return;
  await verificarLimiteRisco(symbol, quantidade);
  const order = await binance.marketBuy(symbol, quantidade);
  const preco = parseFloat(order.fills?.[0]?.price || 0);
  await registrarOrdem('compra', symbol, quantidade, preco);
  await definirStopLossTakeProfit(symbol, quantidade, preco);
  return order;
}

async function comprarLimitado(symbol, quantidade, precoEntrada) {
  if (verificarLimitePerda()) return;
  await verificarLimiteRisco(symbol, quantidade);
  const ordemCompra = await binance.futuresBuy(symbol, quantidade, {
    price: precoEntrada,
    timeInForce: 'GTC',
    type: 'LIMIT',
  });
  await registrarOrdem('compra', symbol, quantidade, precoEntrada);
  await definirStopLossTakeProfit(symbol, quantidade, precoEntrada);
  return ordemCompra;
}

async function vender(symbol = 'BTCUSDT', quantidade = 0.001) {
  if (verificarLimitePerda()) return;
  await verificarLimiteRisco(symbol, quantidade);
  const order = await binance.marketSell(symbol, quantidade);
  const preco = parseFloat(order.fills?.[0]?.price || 0);
  return await registrarOrdem('venda', symbol, quantidade, preco);
}

// ==================== ORDENS ====================
async function listarOrdens(symbol) {
  return await binance.openOrders(symbol);
}

async function historicoOrdens(symbol) {
  return await binance.orders(symbol);
}

// ==================== INDICADORES ====================
function calcularMediaMovel(precos, periodo = 14) {
  const medias = [];
  for (let i = periodo - 1; i < precos.length; i++) {
    const media = precos.slice(i - periodo + 1, i + 1).reduce((acc, val) => acc + val, 0) / periodo;
    medias.push(media);
  }
  return medias;
}

function calcularEMA(precos, periodo) {
  const k = 2 / (periodo + 1);
  let ema = [precos[0]];
  for (let i = 1; i < precos.length; i++) {
    ema.push(precos[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

function calcularRSI(precos, periodo = 14) {
  let ganhos = 0, perdas = 0;
  for (let i = 1; i < periodo; i++) {
    const dif = precos[i] - precos[i - 1];
    if (dif > 0) ganhos += dif;
    else perdas -= dif;
  }
  const rs = ganhos / perdas;
  return 100 - (100 / (1 + rs));
}

function calcularMACD(precos, curto = 12, longo = 26, sinal = 9) {
  const emaCurta = calcularEMA(precos, curto);
  const emaLonga = calcularEMA(precos, longo);
  const macd = emaCurta.map((v, i) => v - emaLonga[i]);
  const sinalLinha = calcularEMA(macd, sinal);
  return { macd, sinal: sinalLinha };
}

// ==================== ANÁLISE DE VOLUME ====================
async function analisarVolume(symbol) {
  const precos = await binance.futuresCandles(symbol, '1h', { limit: 100 });
  const volume = precos.reduce((acc, p) => acc + parseFloat(p.volume), 0);
  console.log(`Volume total no período: ${volume}`);
}

// ==================== BACKTEST ====================
function backtestStrategy(strategy, historicoDados) {
  let lucro = 0;
  historicoDados.forEach(candle => {
    const resultado = strategy(candle);
    lucro += resultado.lucro;
  });
  console.log("Lucro do Backtest: ", lucro);
}

// ==================== ESTRATÉGIAS ====================
async function scalpingStrategy(symbol) {
  const precos = await binance.futuresCandles(symbol, '1m', { limit: 20 });
  const ultimoPreco = parseFloat(precos.at(-1).close);
  const mediaPreco = precos.reduce((acc, p) => acc + parseFloat(p.close), 0) / precos.length;

  if (ultimoPreco > mediaPreco) await comprar(symbol, 0.001);
  else if (ultimoPreco < mediaPreco) await vender(symbol, 0.001);
}

async function breakoutStrategy(symbol, limiteSuperior, limiteInferior) {
  const candles = await binance.futuresCandles(symbol, '1h', { limit: 100 });
  const close = parseFloat(candles.at(-1).close);
  if (close > limiteSuperior) await comprar(symbol, 0.001);
  else if (close < limiteInferior) await vender(symbol, 0.001);
}

async function executarEstrategiaMM(symbol) {
  const candles = await binance.futuresCandles(symbol, '1h', { limit: 200 });
  const closes = candles.map(c => parseFloat(c.close));
  const curta = calcularMediaMovel(closes, 50);
  const longa = calcularMediaMovel(closes, 200);
  if (curta.at(-1) > longa.at(-1)) await comprar(symbol, 0.001);
  else await vender(symbol, 0.001);
}

async function executarEstrategiaRSI(symbol) {
  const candles = await binance.futuresCandles(symbol, '1h', { limit: 200 });
  const closes = candles.map(c => parseFloat(c.close));
  const rsi = calcularRSI(closes);
  if (rsi < 30) await comprar(symbol, 0.001);
  else if (rsi > 70) await vender(symbol, 0.001);
}

async function executarEstrategiaMACD(symbol) {
  const candles = await binance.futuresCandles(symbol, '1h', { limit: 200 });
  const closes = candles.map(c => parseFloat(c.close));
  const { macd, sinal } = calcularMACD(closes);
  if (macd.at(-1) > sinal.at(-1)) await comprar(symbol, 0.001);
  else await vender(symbol, 0.001);
}

async function arbitragem(symbol) {
  const precoBinance = await binance.getPrice(symbol);
  const precoCoinbase = await coinbase.getPrice(symbol);

  if (precoBinance < precoCoinbase) {
    await comprar(symbol, 0.001); // Na Binance
    await vender(symbol, 0.001);  // Na Coinbase (simulado)
  } else if (precoCoinbase < precoBinance) {
    await comprar(symbol, 0.001); // Na Coinbase (simulado)
    await vender(symbol, 0.001);  // Na Binance
  }
}

// ==================== EXPORTAÇÃO ====================
module.exports = {
  comprar,
  comprarLimitado,
  vender,
  listarOrdens,
  historicoOrdens,
  calcularValor,
  definirStopLossTakeProfit,
  calcularMediaMovel,
  breakoutStrategy,
  executarEstrategiaMM,
  executarEstrategiaRSI,
  executarEstrategiaMACD,
  scalpingStrategy,
  arbitragem,
  calcularTaxaDeSucesso,
  exibirLucroTotal,
  exibirDrawdownMaximo,
  analisarVolume,
  getPreco,
  backtestStrategy
};













