// services/estrategiasService.js
const binance = require('node-binance-api')().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
});

const { comprar, vender } = require('./binanceService');

async function breakoutStrategy(symbol, limiteSuperior, limiteInferior) {
  const precos = await binance.futuresCandles(symbol, '1h', { limit: 100 });
  const ultimoPreco = parseFloat(precos[precos.length - 1].close);

  if (ultimoPreco > limiteSuperior) {
    await comprar(symbol, 0.001); // Compra no breakout
  } else if (ultimoPreco < limiteInferior) {
    await vender(symbol, 0.001); // Venda no breakout para baixo
  }
}

module.exports = {
  breakoutStrategy,
};

