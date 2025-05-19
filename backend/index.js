require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/tradeRoutes');
const app = express();

const { iniciarAgendador } = require('./jobs/trendScheduler');
iniciarAgendador();

const { proteger } = require('../middlewares/authMiddleware');
router.post('/comprar', proteger, comprarHandler);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const binanceRoutes = require('./routes/binanceRoutes');
app.use('/binance', binanceRoutes);

const iniciarIAAutoScheduler = require('./jobs/iaScheduler');
iniciarIAAutoScheduler();

const iniciarRelatorioDiario = require('./jobs/performanceReport');
iniciarRelatorioDiario();


app.use(express.json());
app.use('/api/trade', tradeRoutes);

mongoose.connect(process.env.DB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));
