import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
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

  return (
    <div>
      <h3>📈 Lucro Diário</h3>
      <LineChart width={600} height={300} data={dados}>
        <Line type="monotone" dataKey="lucro" stroke="#4caf50" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="data" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default GraficoLucro;
