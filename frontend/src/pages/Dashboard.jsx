import React from 'react';
import GraficoLucro from '../components/GraficoLucro';
import TrendPrediction from '../components/TrendPrediction';
import TrendChart from '../components/TrendChart';
import TrendHistory from '../components/TrendHistory';
import BinanceTradePanel from '../components/BinanceTradePanel';
import OrdensPanel from '../components/OrdensPanel';

function Dashboard() {
  return (
    <div>
      <h1>📊 Dashboard</h1>
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



