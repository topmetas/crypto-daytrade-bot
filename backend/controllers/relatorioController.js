const Ordem = require('../models/Ordem');
const path = require('path');
const { gerarRelatorioPDF } = require('../services/pdfService');

/**
 * Handler para gerar o relatório em PDF com todas as ordens.
 */
async function gerarRelatorioHandler(req, res) {
  try {
    const ordens = await Ordem.find();
    const arquivoPDF = await gerarRelatorioPDF(ordens);
    res.sendFile(path.join(__dirname, '..', arquivoPDF)); // Serve o arquivo gerado
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao gerar relatório', detalhe: err.message });
  }
}

/**
 * Handler que retorna o histórico de lucro agrupado por dia.
 */
async function historicoLucroHandler(req, res) {
  try {
    const ordens = await Ordem.find({ lucro: { $ne: null } });

    const resumo = {};
    ordens.forEach(o => {
      const dia = o.data.toISOString().split('T')[0];
      resumo[dia] = (resumo[dia] || 0) + o.lucro;
    });

    res.json(resumo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar histórico de lucro', detalhe: err.message });
  }
}

module.exports = {
  gerarRelatorioHandler,
  historicoLucroHandler
};

