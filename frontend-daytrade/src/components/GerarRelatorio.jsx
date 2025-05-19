import React from 'react';
import API from '../api';

function GerarRelatorio() {
  const gerarPDF = async () => {
    const resposta = await API.get('/relatorios/relatorio-pdf', { responseType: 'blob' });
    const arquivoPDF = new Blob([resposta.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(arquivoPDF);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio.pdf';
    link.click();
  };

  return (
    <div>
      <button onClick={gerarPDF}>🖨 Gerar Relatório em PDF</button>
    </div>
  );
}

export default GerarRelatorio;
