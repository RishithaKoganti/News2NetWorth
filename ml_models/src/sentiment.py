from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load model and tokenizer once (cached)
tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")

def analyze_article(article_text):
    inputs = tokenizer(article_text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1)[0]
    negative = float(probs[0])
    neutral = float(probs[1])
    positive = float(probs[2])

    sentiment_intensity = negative + positive
    return "High Volatile" if sentiment_intensity > 0.6 else "Normal Volatile"