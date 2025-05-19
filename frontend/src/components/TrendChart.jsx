import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import API from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function TrendChart() {
  const [dados, setDados] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function fetchData() {
      const res = await API.get('/trade/historico');
      const labels = res.data.map(e => new Date(e.data).toLocaleTimeString());
      const tendencias = res.data.map(e => {
        if (e.tendencia === 'alta') return 1;
        if (e.tendencia === 'baixa') return -1;
        return 0;
      });

      setDados({
        labels,
        datasets: [
          {
            label: 'Tendência',
            data: tendencias,
            borderColor: 'rgba(75,192,192,1)',
            fill: false
          }
        ]
      });
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>📈 Gráfico de Tendências</h2>
      <Line data={dados} />
    </div>
  );
}

export default TrendChart;
