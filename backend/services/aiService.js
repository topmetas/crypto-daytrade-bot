const { exec } = require('child_process');
const path = require('path');

function obterTendencia() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, '../../ai-model/trend_predictor.py');

    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        return reject(`Erro ao executar script Python: ${stderr}`);
      }
      try {
        const resultado = JSON.parse(stdout);
        resolve(resultado);
      } catch (e) {
        reject(`Erro ao interpretar resposta do Python: ${stdout}`);
      }
    });
  });
}

module.exports = { obterTendencia };
