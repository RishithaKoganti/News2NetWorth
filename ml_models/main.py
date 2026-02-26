from src.data_fetcher import fetch_stock_data, fetch_news
from src.model_train import train_and_save_model
from src.sentiment import analyze_article
from src.predict import predict_today_volatility, run_news_analysis

def main():
    print("1. Training XGBoost model (if not already saved)...")
    # Uncomment the next line only if you need to (re)train
    # stock_df = fetch_stock_data()
    # train_and_save_model(stock_df)

    print("2. Predicting today's volatility from stock data...")
    vol = predict_today_volatility()
    print(f"Today's volatility class: {vol}")

    print("\n3. Fetching latest news...")
    news_df = fetch_news()
    print(news_df.head())

    # Example: analyze the first article
    if not news_df.empty:
        first_article = news_df.iloc[0]['title'] + " " + (news_df.iloc[0]['description'] or "")
        print("\n4. Analyzing first news article...")
        result = run_news_analysis(first_article, get_explanation=True)
        print("Prediction from news:", result['prediction'])
        print("Explanation:\n", result['explanation'])

if __name__ == "__main__":
    main()