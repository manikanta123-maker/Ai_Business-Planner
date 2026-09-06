import httpx
from app.core.config import settings

api_key = settings.GEMINI_API_KEY
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

system_prompt = "You are the AI Strategy Assistant for a startup project called 'Food Delivery'. Concept: 'Eco-friendly fast food delivery.'"
user_message = "How can I make my delivery carbon-neutral?"

# Tracing contents payload format
contents = [
    {
        "role": "user",
        "parts": [{"text": user_message}]
    }
]

payload = {
    "contents": contents,
    "systemInstruction": {"parts": [{"text": system_prompt}]}
}

try:
    resp = httpx.post(url, json=payload, timeout=15.0)
    print("Status Code:", resp.status_code)
    print("Response JSON:", resp.json() if resp.status_code == 200 else resp.text)
except Exception as e:
    print("Exception:", e)
