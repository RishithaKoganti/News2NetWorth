import yfinance as yf
import pandas as pd
import datetime as dt
from newsapi import NewsApiClient
from .config import NEWS_API_KEY, TICKER, LOOKBACK_DAYS, NEWS_DAYS_BACK

def fetch_stock_data():
    end = dt.datetime.now()
    start = end - dt.timedelta(days=LOOKBACK_DAYS)
    df = yf.download(TICKER, start=start, end=end)
    # Flatten MultiIndex columns if present
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df = df.reset_index()
    return df

def fetch_news():
    newsapi = NewsApiClient(api_key=NEWS_API_KEY)
    from_date = (dt.datetime.now() - dt.timedelta(days=NEWS_DAYS_BACK)).strftime('%Y-%m-%d')
    articles = newsapi.get_everything(
        q="Tesla",
        language="en",
        from_param=from_date,
        sort_by="publishedAt",
        page_size=20
    )
    news_list = []
    for article in articles['articles']:
        news_list.append({
            "title": article['title'],
            "description": article['description'],
            "date": article['publishedAt'][:10]
        })
    return pd.DataFrame(news_list)