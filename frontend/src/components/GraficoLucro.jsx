import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import API from '../api';

function GraficoLucro() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/relatorios/lucro-diario');
      const array = Object.entries(res.data).map(([data, lucro]) => ({ data, lucro }));
      setDados(array);
    };
    fetch();
  }, []);

  const drawdown = calcularDrawdown(dados);
  const mediaMovel = calcularMediaMovel(dados);

  // Mescla média móvel com os dados existentes
  const dadosComMedia = dados.map(d => {
    const media = mediaMovel.find(m => m.data === d.data);
    return { ...d, media: media?.media };
  });

  return (
    <div>
      <h3>📈 Lucro Diário</h3>
      <LineChart width={600} height={300} data={dadosComMedia}>
        <Line type="monotone" dataKey="lucro" stroke="#4caf50" name="Lucro" />
        <Line type="monotone" dataKey="media" stroke="#f39c12" name="Média Móvel (7d)" />
        <ReferenceLine y={drawdown} label={`Drawdown: ${drawdown.toFixed(2)}`} stroke="red" strokeDasharray="3 3" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="data" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

// 📉 Drawdown máximo
function calcularDrawdown(dados) {
  let saldoMaximo = 0;
  let drawdownMaximo = 0;

  dados.forEach(o => {
    saldoMaximo = Math.max(saldoMaximo, o.lucro);
    drawdownMaximo = Math.min(drawdownMaximo, o.lucro - saldoMaximo);
  });

  return drawdownMaximo;
}

// 📊 Média móvel simples (7 dias por padrão)
function calcularMediaMovel(dados, periodo = 7) {
  const mediaMovel = [];
  for (let i = periodo - 1; i < dados.length; i++) {
    const media = dados.slice(i - periodo + 1, i + 1).reduce((acc, o) => acc + o.lucro, 0) / periodo;
    mediaMovel.push({ data: dados[i].data, media });
  }
  return mediaMovel;
}

export default GraficoLucro;

