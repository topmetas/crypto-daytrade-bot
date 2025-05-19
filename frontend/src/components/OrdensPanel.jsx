import React, { useEffect, useState } from 'react';
import API from '../api';

function OrdensPanel() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [ordens, setOrdens] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const o = await API.get('/binance/ordens', { params: { symbol } });
      const h = await API.get('/binance/historico', { params: { symbol } });
      setOrdens(o.data);
      setHistorico(h.data);
    };
    fetchData();
  }, [symbol]);

  return (
    <div>
      <h2>📄 Ordens Pendentes</h2>
      <ul>{ordens.map(o => <li key={o.orderId}>{o.side} {o.origQty} @ {o.price}</li>)}</ul>
      <h2>📚 Histórico de Ordens</h2>
      <ul>{historico.slice(0, 10).map(h => <li key={h.orderId}>{h.side} {h.origQty} - {h.status}</li>)}</ul>
    </div>
  );
}

export default OrdensPanel;
