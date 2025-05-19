const express = require('express');
const router = express.Router();
const Ordem = require('../models/Ordem');
const { proteger } = require('../middlewares/authMiddleware');
const { historicoLucroHandler, gerarRelatorioHandler } = require('../controllers/relatorioController');

// Indicadores gerais
router.get('/indicadores', async (req, res) => {
  try {
    const ordensVenda = await Ordem.find({ tipo: 'venda', lucro: { $ne: null } });

    const totalOrdens = ordensVenda.length;
    if (totalOrdens === 0) {
      return res.json({
        lucroAcumulado: 0,
        taxadeSucesso: 0,
        roi: 0
      });
    }

    const lucroAcumulado = ordensVenda.reduce((acc, ordem) => acc + (ordem.lucro || 0), 0);
    const sucesso = ordensVenda.filter(o => o.lucro > 0).length;
    const roiTotal = ordensVenda.reduce((acc, ordem) => acc + (ordem.roi || 0), 0);

    const taxadeSucesso = (sucesso / totalOrdens) * 100;
    const roiMedio = roiTotal / totalOrdens;

    res.json({
      lucroAcumulado,
      taxadeSucesso,
      roi: roiMedio
    });
  } catch (err) {
    console.error('Erro ao calcular indicadores:', err);
    res.status(500).json({ erro: 'Erro ao calcular indicadores' });
  }
});

// Lucro diário (protegido)
router.get('/lucro-diario', proteger, historicoLucroHandler);

// Geração de PDF (protegido)
router.get('/relatorio-pdf', proteger, gerarRelatorioHandler);

module.exports = router;
