from openai import OpenAI
from .config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def llm_explanation(article, prediction):
    prompt = f"""
    Article:
    {article}

    Predicted Volatility: {prediction}

    Explain in 3 lines why this news affects Tesla stock volatility.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content