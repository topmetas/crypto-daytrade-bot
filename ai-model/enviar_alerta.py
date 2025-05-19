import os
import requests

def enviar_alerta_telegram(mensagem):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not bot_token or not chat_id:
        print("Configurações do Telegram não definidas.")
        return

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {"chat_id": chat_id, "text": mensagem}

    try:
        res = requests.post(url, data=data)
        print("Alerta enviado:", res.json())
    except Exception as e:
        print("Erro ao enviar alerta:", e)
