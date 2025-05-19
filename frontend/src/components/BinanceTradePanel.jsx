import React, { useState } from 'react';
import API from '../api';

function BinanceTradePanel() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [quantidade, setQuantidade] = useState('');
  const [mensagem, setMensagem] = useState('');

  const tocarSucesso = () => {
    const audio = new Audio('/success.wav'); // o arquivo deve estar em /public
    audio.play().catch((err) => console.error('Erro ao reproduzir som:', err));
  };

  const realizarOrdem = async (tipo) => {
    try {
      const res = await API.post(`/binance/${tipo}`, {
        symbol,
        quantidade: parseFloat(quantidade),
      });

      setMensagem(`✅ Ordem de ${tipo} realizada com sucesso! ID: ${res.data.resultado.orderId}`);
      tocarSucesso();
    } catch (err) {
      setMensagem(`❌ Erro ao executar ordem: ${err.response?.data?.erro || err.message}`);
    }
  };

  return (
    <div>
      <h2>💸 Painel de Ordens (Binance)</h2>
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Símbolo ex: BTCUSDT"
      />
      <input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        placeholder="Quantidade"
      />
      <button onClick={() => realizarOrdem('comprar')}>Comprar</button>
      <button onClick={() => realizarOrdem('vender')}>Vender</button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default BinanceTradePanel;

