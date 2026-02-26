import joblib
import pandas as pd
from .data_fetcher import fetch_stock_data, fetch_news
from .sentiment import analyze_article
from .llm_explain import llm_explanation

MODEL_PATH = 'models/volatility_model.pkl'

def load_model():
    data = joblib.load(MODEL_PATH)
    return data['model'], data['scaler']

def predict_today_volatility():
    model, scaler = load_model()
    stock_df = fetch_stock_data()
    # Prepare latest features (same as in training)
    latest_close = stock_df['Close'].iloc[-1:].values.reshape(-1, 1)
    latest_scaled = scaler.transform(latest_close)
    pred = model.predict(latest_scaled)[0]
    return "High Volatile" if pred == 1 else "Normal Volatile"

def run_news_analysis(article_text, get_explanation=False):
    pred = analyze_article(article_text)
    result = {"prediction": pred}
    if get_explanation:
        result["explanation"] = llm_explanation(article_text, pred)
    return result