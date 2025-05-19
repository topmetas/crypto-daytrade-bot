import joblib
import pandas as pd
import requests
import os

API_URL = os.getenv("BACKEND_URL", "http://localhost:5000/api")
TOKEN = os.getenv("JWT_TOKEN")

headers = {"Authorization": f"Bearer {TOKEN}"}

def obter_dados_mercado():
    return {
        "rsi": 45,
        "macd": 0.05,
        "bollinger": 1
    }

def fazer_previsao():
    modelo = joblib.load("modelo_tendencia.pkl")
    dados = obter_dados_mercado()
    df = pd.DataFrame([dados])
    tendencia = modelo.predict(df)[0]
    return tendencia

def enviar_para_backend(tendencia):
    try:
        res = requests.post(f"{API_URL}/previsao", json={"tendencia": tendencia}, headers=headers)
        print("Previsão enviada:", res.json())
    except Exception as e:
        print("Erro:", e)

if __name__ == "__main__":
    tendencia = fazer_previsao()
    enviar_para_backend(tendencia)
