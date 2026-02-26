import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score
import xgboost as xgb
import joblib
import os

def prepare_features(df):
    df = df.copy()
    df['return'] = df['Close'].pct_change()
    window = 5
    df['future_volatility'] = df['return'].rolling(window).std().shift(-window)
    threshold = df['future_volatility'].median()
    df['target'] = (df['future_volatility'] > threshold).astype(int)
    df.dropna(inplace=True)
    return df[['Close']], df['target']

def train_and_save_model(stock_df, model_path='models/volatility_model.pkl'):
    X, y = prepare_features(stock_df)
    # Split (no shuffle for time series)
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    scaler = MinMaxScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    clf = xgb.XGBClassifier(n_estimators=300)
    clf.fit(X_train_scaled, y_train)

    # Evaluate
    acc = accuracy_score(y_test, clf.predict(X_test_scaled))
    print(f"Volatility Model Accuracy: {acc:.4f}")

    # Save both model and scaler (needed for prediction)
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump({'model': clf, 'scaler': scaler}, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    # Example usage: run this script directly to train and save
    from data_fetcher import fetch_stock_data
    df = fetch_stock_data()
    train_and_save_model(df)