import random
import json

def predict_next_trend():
    # Simulação de um modelo de IA
    tendencia = random.choice(["alta", "baixa", "neutra"])
    return {"tendencia": tendencia}

if __name__ == "__main__":
    resultado = predict_next_trend()
    print(json.dumps(resultado))

