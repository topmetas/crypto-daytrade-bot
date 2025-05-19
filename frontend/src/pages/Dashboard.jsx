import React, { useState, useEffect } from 'react';
import API from '../api';

import GraficoLucro from '../components/GraficoLucro';
import TrendPrediction from '../components/TrendPrediction';
import TrendChart from '../components/TrendChart';
import TrendHistory from '../components/TrendHistory';
import BinanceTradePanel from '../components/BinanceTradePanel';
import OrdensPanel from '../components/OrdensPanel';

function Dashboard() {
  const [indicadores, setIndicadores] = useState({
    lucroAcumulado: 0,
    taxadeSucesso: 0,
    roi: 0,
  });

  useEffect(() => {
    const fetchIndicadores = async () => {
      try {
        const res = await API.get('/relatorios/indicadores'); // Essa rota deve existir no backend
        setIndicadores(res.data);
      } catch (err) {
        console.error('Erro ao buscar indicadores:', err);
      }
    };

    fetchIndicadores();
  }, []);

  return (
    <div>
      <h1>📊 Dashboard</h1>

      <h3>Lucro Acumulado: {indicadores.lucroAcumulado?.toFixed(2)} USDT</h3>
      <h3>Taxa de Sucesso: {indicadores.taxadeSucesso?.toFixed(2)}%</h3>
      <h3>ROI: {indicadores.roi?.toFixed(2)}%</h3>

      <GraficoLucro />
      <TrendPrediction />
      <TrendChart />
      <TrendHistory />

      <hr />
      <BinanceTradePanel />
      <hr />
      <OrdensPanel />
    </div>
  );
}

export default Dashboard;



