const express = require('express');
const router = express.Router();
const { previsaoTendencia } = require('../controllers/tradeController');

router.get('/previsao', previsaoTendencia);
router.get('/historico', historicoTendencias);


module.exports = router;
