import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GraficoPrevisoes({ dados }) {
  const dadosGrafico = dados.map((item) => ({
    data: new Date(item.data).toLocaleString(),
    valor: item.saldo_simulado || 1000,
  })).reverse();

  return (
    <div className="mb-6 bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl mb-2">Performance Simulada</h2>
      <LineChart width={600} height={300} data={dadosGrafico}>
        <XAxis dataKey="data" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Line type="monotone" dataKey="valor" stroke="#00FFAA" />
      </LineChart>
    </div>
  );
}
