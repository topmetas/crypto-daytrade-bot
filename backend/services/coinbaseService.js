// coinbaseService.js

const axios = require('axios');

const COINBASE_API_URL = 'https://api.coinbase.com/v2';

async function getPrice(symbol = 'BTCUSDT') {
  try {
    // A Coinbase usa par como BTC-USD, ETH-USD etc.
    const formattedSymbol = symbol.replace('USDT', 'USD').replace('USDC', 'USD').replace('/', '-');
    const response = await axios.get(`${COINBASE_API_URL}/prices/${formattedSymbol}/spot`);
    const price = parseFloat(response.data.data.amount);
    return price;
  } catch (error) {
    console.error(`Erro ao buscar preço na Coinbase para ${symbol}:`, error.response?.data || error.message);
    throw new Error(`Falha ao obter preço da Coinbase para ${symbol}`);
  }
}

module.exports = {
  getPrice,
};
