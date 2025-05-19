💹 crypto-daytrade-bot
Bot completo de day trade com criptomoedas, utilizando:

Backend com Node.js + Express + MongoDB

Frontend com React

IA (Inteligência Artificial) em Python com scikit-learn

Integração com a Binance

Alertas por Telegram

Autenticação JWT

Dashboard com gráficos e histórico de ordens

📁 Estrutura de Pastas
bash
Copiar
Editar
crypto-daytrade-bot/
├── backend/              # Node.js + Express + MongoDB
├── frontend/             # React com gráficos e painel
├── ai-model/             # Python + scikit-learn
├── .env                  # Configurações e chaves
└── README.md             # Este arquivo
⚙️ Pré-requisitos
Node.js (v18+)

Python 3.10+

MongoDB

Conta na Binance com API Key e Secret

Conta no Telegram (bot + chat ID)

🔐 Configuração do .env
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

env
Copiar
Editar
# MongoDB
MONGODB_URI=mongodb://localhost:27017/crypto-bot

# JWT
JWT_SECRET=sua_chave_secreta

# Binance
BINANCE_API_KEY=sua_api_key
BINANCE_API_SECRET=sua_api_secret
BINANCE_TESTNET=true

# Telegram
TELEGRAM_BOT_TOKEN=seu_token_telegram
TELEGRAM_CHAT_ID=seu_chat_id

# IA
BACKEND_URL=http://localhost:5000/api
JWT_TOKEN=token_gerado_ao_fazer_login
🚀 Passo a passo para rodar o projeto
1. Clonar o projeto
bash
Copiar
Editar
git clone https://github.com/seu-usuario/crypto-daytrade-bot.git
cd crypto-daytrade-bot
2. Iniciar o Backend
bash
Copiar
Editar
cd backend
npm install
npm run dev
Servidor será iniciado em http://localhost:5000

3. Iniciar o Frontend
bash
Copiar
Editar
cd ../frontend
npm install
npm run dev
Frontend será aberto em http://localhost:5173

4. Rodar a IA
bash
Copiar
Editar
cd ../ai-model
pip install -r requirements.txt
python modelo_tendencia.py     # Treina o modelo
python run_scheduler.py        # Executa previsão automática
📊 Funcionalidades
✅ Previsão de tendência (IA)
✅ Estratégias inteligentes (RSI, MACD, Bollinger, Médias Móveis)
✅ Ordens reais com a Binance (modo teste ou produção)
✅ Dashboard com lucros, gráfico e histórico
✅ Autenticação com JWT
✅ Botão manual “Obter previsão”
✅ Execução periódica automática da IA
✅ Notificações via Telegram
✅ Controle de risco por operação
✅ Backtesting e relatórios diários

📈 Tecnologias
Frontend: React, TailwindCSS, Chart.js

Backend: Express, Mongoose, JWT, Binance API

IA: Python, scikit-learn, joblib, schedule

Infra: MongoDB, .env, Telegram Bot, Docker (opcional)

🧠 Contribuindo com Estratégias
O sistema é modular. Para adicionar novas estratégias:

Edite o arquivo estrategias.js no backend

Crie funções no frontend para exibir as opções

Treine novos modelos no ai-model/

📬 Suporte
Para dúvidas ou sugestões, entre em contato comigo no Telegram ou abra uma issue no repositório.
