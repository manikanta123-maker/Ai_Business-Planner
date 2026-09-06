from app.core.config import settings
import httpx

api_key = settings.GEMINI_API_KEY
print("Testing Gemini API Key:", api_key[:10] + "..." if api_key else "None")

models = [
    "gemini-2.0-flash", 
    "gemini-2.0-flash-lite", 
    "gemini-2.5-pro", 
    "gemini-flash-latest",
    "gemini-pro-latest"
]

for model in models:
    print(f"\n--- Testing model: {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": "Hello, write a 1-sentence business strategy check."}]}]
    }

    try:
        resp = httpx.post(url, json=payload, timeout=15.0)
        print("Status Code:", resp.status_code)
        if resp.status_code == 200:
            print("SUCCESS! Response:", resp.json()["candidates"][0]["content"]["parts"][0]["text"])
        else:
            print("ERROR response:", resp.text[:300])
    except Exception as e:
        print("Exception:", e)



