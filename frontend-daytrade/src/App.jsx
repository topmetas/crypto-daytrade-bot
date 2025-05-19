import React, { useEffect, useState } from 'react';
import TradePanel from './components/TradePanel';
import TrendPrediction from './components/TrendPrediction';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLogado(!!token);
  }, []);

  const handleLogin = () => {
    setLogado(true);
  };

  return (
    <div>
      <h1>Crypto Daytrade Bot</h1>
      {logado ? (
        <Dashboard>
          <TrendPrediction />
          <TradePanel />
        </Dashboard>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

