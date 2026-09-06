"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Shield, Users, LineChart, Globe, Zap, Compass, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              AI Business Architect
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-zinc-200 transition-colors">How it Works</a>
            <a href="#value" className="hover:text-zinc-200 transition-colors">Success Criteria</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/projects/demo" 
              className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Live Demo</span>
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 h-9 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs text-indigo-400 font-medium mb-8 animate-fade-in">
          <Zap className="h-3.5 w-3.5" />
          <span>Next-Generation Startup Workspace</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Explore, Validate & Map Your{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
            Next Business Venture
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Not a chatbot. Not a static report builder. A professional startup exploration platform that transforms raw ideas into structured, data-driven business blueprints.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-base font-semibold text-white hover:from-indigo-400 hover:to-violet-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/25"
          >
            <Sparkles className="h-5 w-5" />
            <span>⚡ Explore Live Interactive Demo</span>
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 py-4 text-base font-semibold text-zinc-200 hover:bg-zinc-900 hover:text-white transition-all hover:border-zinc-700"
          >
            Create Your Free Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mockup Preview Area */}
        <div className="mt-16 sm:mt-24 relative rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-2 shadow-2xl shadow-indigo-500/5 backdrop-blur-sm max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl pointer-events-none"></div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden aspect-[16/10] flex flex-col">
            {/* Mock Workspace Header */}
            <div className="h-11 border-b border-zinc-900 bg-zinc-900/40 px-4 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
                </div>
                <span className="font-mono ml-4 text-zinc-400">workspace / ai-recruiter</span>
              </div>
              <div className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                Blueprint Locked
              </div>
            </div>
            
            {/* Mock Workspace Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-zinc-900 bg-zinc-950 p-3 flex flex-col gap-1 text-left">
                <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Workspace Navigation</div>
                <div className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-semibold">Overview</div>
                <div className="px-3 py-2 rounded-lg text-zinc-500 text-xs hover:text-zinc-300">Competitors</div>
                <div className="px-3 py-2 rounded-lg text-zinc-500 text-xs hover:text-zinc-300">Market Research</div>
                <div className="px-3 py-2 rounded-lg text-zinc-500 text-xs hover:text-zinc-300">Customer Persona</div>
                <div className="px-3 py-2 rounded-lg text-zinc-500 text-xs hover:text-zinc-300">Financial Forecast</div>
              </div>
              {/* Content Panel */}
              <div className="flex-1 p-6 text-left overflow-y-auto">
                <h3 className="text-lg font-bold text-zinc-200 mb-2">Startup Blueprint: AI Recruitment Platform</h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  An automated vetting platform using LLM interview simulations to rank software developers based on technical expertise, soft skills, and communication patterns.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-zinc-900 bg-zinc-900/30 p-4 rounded-xl">
                    <div className="text-[10px] font-medium text-zinc-500 mb-1">Target Market</div>
                    <div className="text-sm font-bold text-indigo-400">Mid-market Tech Companies</div>
                  </div>
                  <div className="border border-zinc-900 bg-zinc-900/30 p-4 rounded-xl">
                    <div className="text-[10px] font-medium text-zinc-500 mb-1">Estimated Launch Cost</div>
                    <div className="text-sm font-bold text-emerald-400">$45,000 (MVP Setup)</div>
                  </div>
                </div>
              </div>
              {/* Right Sidebar Chat */}
              <div className="w-56 border-l border-zinc-900 bg-zinc-950 p-4 flex flex-col justify-between text-left">
                <div className="text-xs">
                  <div className="font-semibold text-zinc-300 mb-2">AI Strategy Assistant</div>
                  <div className="rounded-lg bg-zinc-900 p-2.5 text-zinc-400 text-[11px] leading-relaxed">
                    Based on your target market, I recommend focusing initial outbound marketing on companies with 50-200 engineers.
                  </div>
                </div>
                <div className="border border-zinc-850 rounded bg-zinc-900 px-2.5 py-1.5 text-[10px] text-zinc-500">
                  Ask strategy advice...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-y border-zinc-900 bg-zinc-900/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Comprehensive Analysis Across 8 Core Business Facets
            </h2>
            <p className="text-zinc-400 text-base">
              The blueprint engine leverages search tools and deep models to formulate insights tailored directly to your idea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-indigo-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <Compass className="h-8 w-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Business Overview</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Feasibility metrics, business model recommendations, and clear industry categorization.
              </p>
            </div>
            
            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-violet-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <Globe className="h-8 w-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Competitor Maps</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automated discovery of real-world companies with feature-by-feature positioning.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-pink-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <BarChart3 className="h-8 w-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Market Dynamics</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                TAM/SAM/SOM estimates, growth potentials, demand signals, and sector trends.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <Users className="h-8 w-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Customer Analysis</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Persona matrices detailing core segments, key pain points, and adoption barriers.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-emerald-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <LineChart className="h-8 w-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Financial Models</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Structured startup costs, licensing templates, operational budgets, and break-even maps.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-red-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <Shield className="h-8 w-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Risk Assessments</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Evaluation of technical, financial, and legal vulnerabilities, paired with mitigations.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <Zap className="h-8 w-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Funding Advisory</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Targeted funding path suggestions including grants, accelerators, bootstrapping, and VC.
              </p>
            </div>

            <div className="group border border-zinc-800/80 bg-zinc-950 p-6 rounded-2xl hover:border-cyan-500/50 hover:bg-zinc-900/20 transition-all duration-300">
              <ArrowRight className="h-8 w-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-zinc-200 mb-2">Launch Roadmap</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                12-month calendar plan tracking core milestones, MVP scoping, and customer acquisition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} AI Business Architect. All rights reserved.</p>
        <p className="mt-2 text-zinc-600">Built for modern builders, venture teams, and startup validation.</p>
      </footer>
    </div>
  );
}
