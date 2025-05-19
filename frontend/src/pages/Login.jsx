import React, { useState } from 'react';
import API from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, senha });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setErro('Credenciais inválidas');
    }
  };

  return (
    <div>
      <h2>🔐 Login</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleLogin}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
