const cron = require('node-cron');
const { obterTendencia } = require('../services/aiService');
const Trend = require('../models/Trend');

function iniciarAgendador() {
  // Executa a cada minuto (pode ajustar o intervalo)
  cron.schedule('* * * * *', async () => {
    try {
      const resultado = await obterTendencia();
      const novaTendencia = new Trend({
        tendencia: resultado.tendencia,
        data: new Date(),
      });
      await novaTendencia.save();
      console.log('[IA agendada] Tendência salva:', resultado.tendencia);
    } catch (err) {
      console.error('Erro na execução automática:', err);
    }
  });
}

module.exports = { iniciarAgendador };
