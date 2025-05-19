const PDFDocument = require('pdfkit');
const fs = require('fs');

function gerarRelatorioPDF(ordens) {
  const doc = new PDFDocument();
  const caminhoArquivo = `relatorio_${Date.now()}.pdf`;

  doc.pipe(fs.createWriteStream(caminhoArquivo));

  doc.fontSize(18).text('📊 Relatório de Ordens e Lucro', { align: 'center' });

  ordens.forEach((ordem, index) => {
    doc.fontSize(12).text(
      `${index + 1}. ${ordem.tipo.toUpperCase()} - ${ordem.symbol} | Quantidade: ${ordem.quantidade} | Preço: ${ordem.preco} | Lucro: ${ordem.lucro || 'Não calculado'}`
    );
  });

  doc.end();

  return caminhoArquivo;
}

module.exports = { gerarRelatorioPDF };
