const cron = require('node-cron');
const Ordem = require('../models/Ordem');
const { notificarTelegram } = require('../services/telegramService');

function iniciarRelatorioDiario() {
  cron.schedule('0 23 * * *', async () => {  // todo dia às 23h
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ordens = await Ordem.find({ data: { $gte: hoje } });
    const lucroTotal = ordens.reduce((acc, o) => acc + (o.lucro || 0), 0);

    const msg = `
📊 *Relatório Diário de Performance*
Total de ordens: ${ordens.length}
Lucro total: ${lucroTotal.toFixed(2)} USDT
    `;
    await notificarTelegram(msg);
    console.log('Relatório diário enviado');
  });
}

module.exports = iniciarRelatorioDiario;
