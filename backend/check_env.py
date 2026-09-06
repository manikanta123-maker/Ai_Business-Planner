from app.core.config import settings
print("Loaded Settings Verification:")
print("GEMINI_API_KEY:", settings.GEMINI_API_KEY[:10] + "..." if settings.GEMINI_API_KEY else "None")
print("TAVILY_API_KEY:", settings.TAVILY_API_KEY[:10] + "..." if settings.TAVILY_API_KEY else "None")
