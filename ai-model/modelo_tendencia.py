import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Simulando dados históricos
def gerar_dados():
    df = pd.DataFrame({
        'rsi': [30, 50, 70, 60, 40, 80],
        'macd': [0.1, -0.2, 0.3, -0.1, 0.0, 0.4],
        'bollinger': [1, 0, 1, 0, 1, 1],
        'tendencia': ['alta', 'baixa', 'alta', 'baixa', 'alta', 'alta']
    })
    return df

def treinar_modelo():
    df = gerar_dados()
    X = df[['rsi', 'macd', 'bollinger']]
    y = df['tendencia']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    modelo = RandomForestClassifier()
    modelo.fit(X_train, y_train)

    y_pred = modelo.predict(X_test)
    print(f"Acurácia: {accuracy_score(y_test, y_pred)}")

    joblib.dump(modelo, 'modelo_tendencia.pkl')

if __name__ == "__main__":
    treinar_modelo()
