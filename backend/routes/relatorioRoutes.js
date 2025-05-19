const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/authMiddleware');
const { historicoLucroHandler } = require('../controllers/relatorioController');

router.get('/lucro-diario', proteger, historicoLucroHandler);
router.get('/relatorio-pdf', proteger, gerarRelatorioHandler);


module.exports = router;
