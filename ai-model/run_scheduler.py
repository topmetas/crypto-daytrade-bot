import schedule
import time
import subprocess

def rodar_script():
    subprocess.run(["python", "predict_and_send.py"])

# Executa a cada 5 minutos
schedule.every(5).minutes.do(rodar_script)

print("Scheduler iniciado...")
while True:
    schedule.run_pending()
    time.sleep(1)
