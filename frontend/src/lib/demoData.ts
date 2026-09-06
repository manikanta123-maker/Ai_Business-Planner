export interface DemoProject {
  id: number | string;
  title: string;
  business_idea: string;
  status: string;
  created_at: string;
  blueprint: {
    overview: string;
    competitors: string;
    market_research: string;
    customers: string;
    financials: string;
    funding: string;
    risks: string;
    roadmap: string;
    generated_at: string;
  };
  messages: Array<{
    id: number;
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export const DEMO_PROJECT: DemoProject = {
  id: "demo",
  title: "AI Video Editing & Auto-Repurposing SaaS",
  business_idea: "An AI-powered video editing platform that automatically converts long-form podcasts and webinars into viral, captioned short clips for TikTok, Instagram Reels, and YouTube Shorts.",
  status: "completed",
  created_at: "2026-03-01T00:00:00.000Z",
  blueprint: {
    overview: `### Executive Summary & Business Overview

- **Concept**: Next-generation automated video intelligence engine designed for creators, media agencies, and podcasters.
- **Value Proposition**: Reduce video editing turnaround time by 90% by automatically identifying engaging segments, generating animated captions, dynamic B-roll, and multi-platform aspect ratio conversions.
- **Target Sector**: Creator Economy, B2B SaaS, Content Marketing Automation.
- **Monetization Model**: Tiered monthly subscription ($29/mo Creator, $89/mo Pro Agency) plus credit-based pay-as-you-go rendering.
- **Feasibility**: High feasibility utilizing serverless GPU transcription (Whisper), speech diarization, and LLM highlight extraction.`,
    competitors: `### Competitive Landscape & Positioning

| Competitor | Core Strength | Key Vulnerability | Our Differentiation Moat |
| :--- | :--- | :--- | :--- |
| **OpusClip** | Fast short-form extraction | Limited brand template customization | Deep agency workflow integrations & custom brand kits |
| **Descript** | Text-based editing | Steep learning curve for quick social clips | 1-Click zero-timeline automated publishing |
| **CapCut** | Free consumer templates | Manual editing required, privacy concerns for B2B | Enterprise SOC2 compliance & direct multi-account scheduling |

**Competitive Advantage:**
1. Proprietary Viral Score Algorithm trained on top 50,000 viral reels.
2. Direct 1-click social media auto-publishing via official APIs.
3. Multi-language automated voice translation and lip-sync.`,
    market_research: `### Market Dynamics & Sizing (TAM / SAM / SOM)

- **Total Addressable Market (TAM)**: $48.2 Billion global video editing & content creation market by 2028 (CAGR: 16.4%).
- **Serviceable Available Market (SAM)**: $7.8 Billion short-form marketing & creator automation software.
- **Serviceable Obtainable Market (SOM)**: $85 Million targeting English-speaking content creators, marketing agencies, and podcast networks in Years 1–3.

**Key Growth Drivers:**
- 73% of consumers prefer watching short-form videos to learn about a product.
- Algorithms on Instagram, TikTok, and YouTube prioritize accounts posting 3-5x daily shorts.`,
    customers: `### Target Customer Personas & ICP

#### 1. "Agency Alex" – Digital Marketing Agency Owner
- **Company Size**: 5–25 employees, managing 15+ client social accounts.
- **Core Pain Point**: Video editors spend 4+ hours per episode cutting vertical clips with manual captions.
- **Willingness to Pay**: $150–$300/month for team collaboration and bulk batch processing.

#### 2. "Creator Chris" – Full-Time Podcaster & YouTuber
- **Audience Size**: 50k–500k subscribers.
- **Core Pain Point**: Lacks time to edit daily shorts while producing weekly 1-hour episodes.
- **Willingness to Pay**: $29–$59/month for instant automated clip rendering.`,
    financials: `### 3-Year Financial Model & Unit Economics

| Metric | Year 1 | Year 2 | Year 3 |
| :--- | :--- | :--- | :--- |
| **Paying Customers** | 450 | 2,800 | 9,500 |
| **Average Revenue Per User (ARPU)** | $42/mo | $54/mo | $68/mo |
| **Annual Recurring Revenue (ARR)** | **$226,800** | **$1,814,400** | **$7,752,000** |
| **Gross Margin** | 78% | 83% | 86% |
| **Net Burn / Profit** | ($45,000) | $320,000 | $2,450,000 |

- **Customer Acquisition Cost (CAC)**: $85 (via organic TikTok/YouTube product-led growth).
- **Lifetime Value (LTV)**: $648 (Avg retention: 12 months).
- **LTV/CAC Ratio**: **7.6x** (Target benchmark > 3.0x).`,
    funding: `### Capital Requirements & Funding Strategy

- **Initial Stage**: Bootstrapping / Pre-Seed ($100,000 target).
- **Capital Allocation**:
  - 50% Cloud GPU rendering infrastructure & AI API costs.
  - 30% Full-stack engineering & mobile optimization.
  - 20% Growth marketing & affiliate partnership program.
- **Next Funding Milestone**: Apply to Y Combinator / Techstars with $25k MRR and 500 active paying users.`,
    risks: `### Risk Assessment & Mitigation Plan

1. **AI API Cost Spikes (GPU rendering costs)**:
   - *Mitigation*: Implement self-hosted open-source Whisper & FFmpeg microservices on spot GPU instances to reduce rendering costs by 70%.
2. **Platform Algorithm Shifts (TikTok / Instagram API changes)**:
   - *Mitigation*: Diversify supported platforms (LinkedIn Video, YouTube Shorts, X Video, Facebook Reels).
3. **High User Churn**:
   - *Mitigation*: Introduce multi-user workspaces, recurring brand templates, and scheduled auto-publishing to make the tool indispensable for daily operations.`,
    roadmap: `### 12-Month Execution Roadmap

- **Q1 (Months 1–3)**: MVP Launch — AI highlight detection, automatic 9:16 aspect ratio framing, auto animated captions.
- **Q2 (Months 4–6)**: Public Beta & Monetization — Tiered Stripe billing, custom font/brand styling, B-roll library integration.
- **Q3 (Months 7–9)**: Multi-Account Agency Hub — Team permissions, client approval portals, and multi-social auto-scheduling.
- **Q4 (Months 10–12)**: AI Voice Translation & Lip-Sync — Expand to 25+ global languages for international audience repurposing.`,
    generated_at: "2026-03-01T00:00:00.000Z"
  },
  messages: [
    {
      id: 1,
      role: "assistant",
      content: "Hello! I am your AI Strategy Co-Pilot for **AI Video Editing & Auto-Repurposing SaaS**. I have analyzed your 8-pillar business blueprint. How can I help you refine your pricing, marketing channels, or technical architecture today?",
      timestamp: "2026-03-01T00:00:00.000Z"
    }
  ]
};
