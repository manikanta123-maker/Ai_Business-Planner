from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
import httpx
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.models import User, Project, ProjectBlueprint, Message
from app.schemas import schemas
from app.core.config import settings

# Attempt to import OpenAI / Gemini if key is provided
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

router = APIRouter(prefix="/projects/{project_id}/chat", tags=["chat"])

@router.get("/history", response_model=List[schemas.MessageResponse])
def get_chat_history(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    messages = db.query(Message).filter(Message.project_id == project_id).order_by(Message.timestamp.asc()).all()
    return messages

@router.post("", response_model=schemas.MessageResponse)
def post_chat_message(
    project_id: int,
    message_in: schemas.MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Save User message
    user_msg = Message(
        project_id=project_id,
        role="user",
        content=message_in.content
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    # Fetch blueprint context to feed into LLM system prompt
    blueprint = db.query(ProjectBlueprint).filter(ProjectBlueprint.project_id == project_id).first()
    blueprint_context = ""
    if blueprint:
        blueprint_context = f"""
Here is the current startup blueprint generated for this project:
Overview: {blueprint.overview}
Competitors: {blueprint.competitors}
Market Research: {blueprint.market_research}
Customers: {blueprint.customers}
Financials: {blueprint.financials}
Funding: {blueprint.funding}
Risks: {blueprint.risks}
Roadmap: {blueprint.roadmap}
"""

    system_prompt = f"""
You are the AI Strategy Assistant for this startup project.
The business title is: "{project.title}"
The core business concept is: "{project.business_idea}"

{blueprint_context}

Your purpose is to answer the user's questions about their business, review their report section details, explain specific sections, or recommend business growth steps. Make your responses highly strategic, realistic, and clear. Avoid repeating information that is already available in the project overview.
"""

    ai_response_content = ""

    # 1. Try Gemini first
    if settings.GEMINI_API_KEY:
        models_to_try = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"]
        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
                
                chat_history = db.query(Message).filter(Message.project_id == project_id).order_by(Message.timestamp.asc()).all()
                contents_payload = []
                for msg in chat_history:
                    role = "user" if msg.role == "user" else "model"
                    contents_payload.append({"role": role, "parts": [{"text": msg.content}]})
                    
                payload = {
                    "contents": contents_payload,
                    "systemInstruction": {"parts": [{"text": system_prompt}]}
                }
                
                resp = httpx.post(url, json=payload, timeout=20.0)
                if resp.status_code == 200:
                    result = resp.json()
                    ai_response_content = result['candidates'][0]['content']['parts'][0]['text']
                    print(f"Gemini chat succeeded with model: {model}")
                    break
                else:
                    print(f"Gemini API ({model}) returned error: {resp.status_code} - {resp.text[:200]}")
            except Exception as e:
                print(f"Gemini chat exception for {model}: {e}")

    # 2. Try OpenAI second
    if not ai_response_content and settings.OPENAI_API_KEY and OpenAI:
        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            chat_history = db.query(Message).filter(Message.project_id == project_id).order_by(Message.timestamp.asc()).all()
            messages_payload = [{"role": "system", "content": system_prompt}]
            
            for msg in chat_history:
                messages_payload.append({
                    "role": "user" if msg.role == "user" else "assistant",
                    "content": msg.content
                })
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages_payload,
                max_tokens=800
            )
            ai_response_content = response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI chat exception: {e}")
                
    # 3. Fallback to dynamic context-aware mockup responses if no AI API responded
    if not ai_response_content:
        prompt_lower = message_in.content.lower()
        title = project.title
        idea = project.business_idea
        
        # Smart keyword detection
        if any(w in prompt_lower for w in ["hi", "hello", "hey", "greetings", "gday"]):
            ai_response_content = f"Hello! I am your AI Strategy Assistant for **{title}**. I have analyzed your core concept: '{idea[:80]}...'. Ask me anything about marketing channels, competitors, financial targets, or scaling plans!"
        elif any(w in prompt_lower for w in ["compet", "rival", "vs", "other business", "alternat"]):
            ai_response_content = f"To out-position your competitors in the **{title}** space, you should focus on your unique advantage. While generic alternatives offer standard features, your plan of '{idea[:100]}...' targets a specific segment. I suggest launching a comparison landing page highlighting your direct integration capabilities."
        elif any(w in prompt_lower for w in ["market", "size", "trend", "industry", "sector"]):
            ai_response_content = f"The market trends for **{title}** show high demand for automated, localized workflows. Your focus on '{idea[:60]}' aligns directly with this growth shift. Outreaching to early adopters in niche tech hubs will allow you to capture initial share before scaling."
        elif any(w in prompt_lower for w in ["money", "cost", "finance", "price", "revenue", "budget", "pricing", "dollar", "spend"]):
            ai_response_content = f"For **{title}**, your target budget should reflect the costs in your Financials dashboard. I recommend focusing initial capital on product styling and infrastructure, while pricing your offering at a premium tier to hit your break-even target within 6 months."
        elif any(w in prompt_lower for w in ["risk", "danger", "fail", "threat", "legal", "problem"]):
            ai_response_content = f"The primary operational threat for **{title}** is API changes and early customer churn. You can mitigate this by implementing error fallbacks and designing a simple onboarding checklist to ensure users get value immediately."
        elif any(w in prompt_lower for w in ["customer", "persona", "user", "audience", "client"]):
            ai_response_content = f"Your target customers for **{title}** are looking to eliminate inefficiencies. Focus your initial product positioning on solving their specific pain point: '{idea[:80]}...'. Direct outbound campaigns to operational managers will yield your first 10 customers."
        elif any(w in prompt_lower for w in ["launch", "roadmap", "start", "growth", "mvp"]):
            ai_response_content = f"Your execution roadmap for **{title}** starts with an MVP release in Month 1. The key is launching early with a basic version of your concept ('{idea[:60]}...') to gather user validation reviews before scaling marketing budgets."
        elif any(w in prompt_lower for w in ["funding", "invest", "vc", "angel", "raise", "equity"]):
            ai_response_content = f"For **{title}**, I recommend starting with bootstrapping or applying to accelerators (like YCombinator). Once you have onboarded your first 20-30 active users, you will have the necessary metrics to pitch local angel investors."
        else:
            # Custom keyword extraction to formulate a personalized reply
            words = [w for w in prompt_lower.split() if len(w) > 4 and w not in ["about", "would", "could", "should", "there", "their", "please", "strategy"]]
            topic = f"'{words[0]}'" if words else "business strategy"
            ai_response_content = f"Regarding your question about {topic} for **{title}**, my recommendation is to link this directly to your core objective: '{idea[:100]}...'. I suggest setting up specific feedback loops to analyze {topic} trends during your private beta launch."

    # Save Assistant message
    assistant_msg = Message(
        project_id=project_id,
        role="assistant",
        content=ai_response_content
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg
