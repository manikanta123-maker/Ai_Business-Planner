import asyncio
import httpx
from app.core.config import settings
from app.api.blueprint import generate_llm_content, search_tavily, get_fallback_markdown

async def test_generation():
    print("Testing Blueprint Generation Subsections:")
    print("Tavily Key Configured:", settings.TAVILY_API_KEY[:10] + "..." if settings.TAVILY_API_KEY else "None")
    print("Gemini Key Configured:", settings.GEMINI_API_KEY[:10] + "..." if settings.GEMINI_API_KEY else "None")

    title = "Organic Coffee Delivery"
    idea = "A subscription service delivering organic, single-origin coffee beans sourced directly from fair-trade farms to customers' doors weekly."

    # Test Overview generation (no search needed)
    print("\n--- Testing Business Overview (LLM Only) ---")
    system_prompt = "You are a professional business strategist. Return your output in clean Markdown."
    prompt = f"Generate the Business Overview section for: {title} - {idea}"
    
    try:
        overview = await generate_llm_content(prompt, system_prompt)
        print("Overview length:", len(overview))
        if overview.strip():
            print("First 200 chars:")
            print(overview[:200])
        else:
            print("Overview generation returned EMPTY. Triggered fallback template.")
    except Exception as e:
        print("Overview generation failed:", e)

    # Test Competitors generation (with Tavily search)
    print("\n--- Testing Competitors (Search + LLM) ---")
    try:
        search_query = f"{title} Competitor Analysis real data statistics"
        search_context = await search_tavily(search_query)
        print("Tavily search results length:", len(search_context))
        
        prompt_comp = f"Generate the Competitor Analysis section for: {title} - {idea}\nSearch Context:\n{search_context}"
        comp = await generate_llm_content(prompt_comp, system_prompt)
        print("Competitor output length:", len(comp))
        if comp.strip():
            print("First 200 chars:")
            print(comp[:200])
        else:
            print("Competitor generation returned EMPTY. Triggered fallback template.")
    except Exception as e:
        print("Competitor generation failed:", e)

if __name__ == "__main__":
    asyncio.run(test_generation())
