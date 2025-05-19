import React, { useEffect, useState } from 'react';
import API from '../api';

function TrendPrediction() {
  const [tendencia, setTendencia] = useState('Clique para prever');

  const obterPrevisao = async () => {
    setTendencia('Carregando...');
    try {
      const res = await API.get('/trade/previsao');
      setTendencia(res.data.tendencia);
    } catch {
      setTendencia('Erro ao obter previsão');
    }
  };

  return (
    <div>
      <h2>📈 Tendência Prevista:</h2>
      <p><strong>{tendencia}</strong></p>
      <button onClick={obterPrevisao}>Obter Previsão Agora</button>
    </div>
  );
}

  useEffect(() => {
    async function fetchTendencia() {
      try {
        const res = await API.get('/trade/previsao');
        setTendencia(res.data.tendencia);
      } catch (err) {
        setTendencia('Erro ao obter previsão');
      }
    }

    fetchTendencia();
  }, []);

  return (
    <div>
      <h2>📈 Tendência Prevista:</h2>
      <p><strong>{tendencia}</strong></p>
    </div>
  );
}

export default TrendPrediction;
