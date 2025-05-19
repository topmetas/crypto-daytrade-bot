const cron = require('node-cron');
const axios = require('axios');

const URL = 'http://localhost:5000/ia/prever'; // rota protegida, adicione token se necessário

function iniciarIAAutoScheduler() {
  cron.schedule('*/15 * * * *', async () => {  // a cada 15 minutos
    try {
      await axios.post(URL, { symbol: 'BTCUSDT' });
      console.log('IA executada automaticamente');
    } catch (err) {
      console.error('Erro na IA automática:', err.message);
    }
  });
}

module.exports = iniciarIAAutoScheduler;
