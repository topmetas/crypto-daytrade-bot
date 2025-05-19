import React, { useEffect, useState } from 'react';
import API from '../api';

function TrendHistory() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await API.get('/trade/historico');
        setHistorico(res.data);
      } catch {
        setHistorico([]);
      }
    }

    fetchHistorico();
  }, []);

  return (
    <div>
      <h2>📜 Histórico de Tendências</h2>
      <ul>
        {historico.map((item, i) => (
          <li key={i}>
            <strong>{item.tendencia}</strong> – {new Date(item.data).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrendHistory;
