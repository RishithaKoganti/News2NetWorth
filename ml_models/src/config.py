import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Add any other configuration constants here
TICKER = "TSLA"
LOOKBACK_DAYS = 365
NEWS_DAYS_BACK = 7