const express = require('express');
const router = express.Router();
const { proteger } = require('../middlewares/authMiddleware');
const { comprarHandler, venderHandler } = require('../controllers/binanceController');

router.post('/comprar', proteger, comprarHandler);
router.post('/vender', proteger, venderHandler);

router.get('/ordens', proteger, listarOrdensHandler);
router.get('/historico', proteger, historicoOrdensHandler);


module.exports = router;
