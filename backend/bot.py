import os
from dotenv import load_dotenv
from pathlib import Path
import google.generativeai as genai

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

def ask_chatbot(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        if "quota" in str(e).lower():
            return "⚠️ Gemini quota limit exceeded. Try again later or reduce request frequency."
        return f"⚠️ Error from Gemini API: {e}"

