"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Compass, Play, Loader2, Sparkles, MessageSquare, 
  Send, Bot, User, CheckCircle2, ChevronRight, Download, FileText,
  AlertTriangle, Milestone, ShieldCheck, HeartHandshake, TrendingUp, Users, Target
} from "lucide-react";

interface Blueprint {
  overview?: string;
  competitors?: string;
  market_research?: string;
  customers?: string;
  financials?: string;
  funding?: string;
  risks?: string;
  roadmap?: string;
}

interface Message {
  id: number;
  role: string;
  content: string;
}

interface Project {
  id: number;
  title: string;
  business_idea: string;
  status: string;
}

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generation States
  const [generating, setGenerating] = useState(false);
  const [genSteps, setGenSteps] = useState<Array<{ name: string; status: "pending" | "running" | "completed" }>>([
    { name: "Business Overview", status: "pending" },
    { name: "Competitor Analysis", status: "pending" },
    { name: "Market Research", status: "pending" },
    { name: "Customer Analysis", status: "pending" },
    { name: "Financial Planning", status: "pending" },
    { name: "Risk Analysis", status: "pending" },
    { name: "Funding Suggestions", status: "pending" },
    { name: "Launch Roadmap", status: "pending" },
  ]);

  // Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial project metadata & checks login
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadWorkspace = async () => {
      try {
        // 1. Fetch Project Details
        const projResp = await fetch(`http://localhost:8000/api/v1/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!projResp.ok) throw new Error("Could not find project workspace.");
        const projData = await projResp.json();
        setProject(projData);

        // 2. If status is completed, load existing blueprint
        if (projData.status === "completed") {
          const blueprintResp = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/blueprint`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (blueprintResp.ok) {
            const blueprintData = await blueprintResp.json();
            setBlueprint(blueprintData);
          }
        }

        // 3. Load Chat History
        const chatResp = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/chat/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (chatResp.ok) {
          const chatData = await chatResp.json();
          setChatHistory(chatData);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred loading the workspace.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [projectId, router]);

  // Scroll to bottom on new chat message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleGenerateBlueprint = async () => {
    setError(null);
    setGenerating(true);
    setGenSteps(prev => prev.map(s => ({ ...s, status: "pending" })));

    const token = localStorage.getItem("access_token");
    
    // Create EventSource connection to read generation stream in real time
    const eventSource = new EventSource(
      `http://localhost:8000/api/v1/projects/${projectId}/blueprint/generate/stream?token=${token}`
    );

    let activeStepIndex = 0;
    setGenSteps(prev => {
      const copy = [...prev];
      copy[0].status = "running";
      return copy;
    });

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.section) {
        setGenSteps(prev => {
          const updated = prev.map((step, idx) => {
            if (step.name === data.section) {
              return { ...step, status: "completed" as const };
            }
            return step;
          });
          
          // Mark next step as running
          const nextIdx = updated.findIndex(s => s.status === "pending");
          if (nextIdx !== -1) {
            updated[nextIdx].status = "running" as const;
          }
          return updated;
        });
      }

      if (data.status === "finished") {
        eventSource.close();
        // Reload project blueprint details
        const fetchBlueprint = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/blueprint`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setBlueprint(data);
              setProject(prev => prev ? { ...prev, status: "completed" } : null);
            }
          } catch (e) {
            console.error(e);
          } finally {
            setGenerating(false);
          }
        };
        fetchBlueprint();
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      eventSource.close();
      setError("An error occurred during blueprint generation. Please try again.");
      setGenerating(false);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatInput("");
    setChatLoading(true);
    
    // Optimistic local add
    const tempUserMsg = { id: Date.now(), role: "user", content: userText };
    setChatHistory(prev => [...prev, tempUserMsg]);

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: userText })
      });

      if (!response.ok) throw new Error("Could not send message.");
      const reply = await response.json();
      
      // Update chat history with real message object
      setChatHistory(prev => [...prev.filter(m => m.id !== tempUserMsg.id), reply]);
    } catch (err: any) {
      setError("Could not communicate with chat assistant.");
      setChatHistory(prev => prev.filter(m => m.id !== tempUserMsg.id));
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "competitors", label: "Competitors", icon: Target },
    { id: "market_research", label: "Market Research", icon: TrendingUp },
    { id: "customers", label: "Customer Analysis", icon: Users },
    { id: "financials", label: "Financials", icon: Milestone },
    { id: "funding", label: "Funding Strategy", icon: HeartHandshake },
    { id: "risks", label: "Risk Assessment", icon: AlertTriangle },
    { id: "roadmap", label: "Launch Roadmap", icon: ShieldCheck },
  ];

  const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let listKey = 0;

    const pushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-3 my-4 pl-1">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInlineStyles = (text: string) => {
      let parts: { text: string; isBold?: boolean; isItalic?: boolean }[] = [{ text }];

      // Parse Bold: **text** or __text__
      const boldRegex = /(\*\*|__)(.*?)\1/g;
      let boldParts: typeof parts = [];
      parts.forEach(part => {
        if (part.isBold || part.isItalic) {
          boldParts.push(part);
          return;
        }
        let lastIndex = 0;
        let match;
        boldRegex.lastIndex = 0;
        while ((match = boldRegex.exec(part.text)) !== null) {
          const textBefore = part.text.substring(lastIndex, match.index);
          if (textBefore) {
            boldParts.push({ text: textBefore });
          }
          boldParts.push({ text: match[2], isBold: true });
          lastIndex = boldRegex.lastIndex;
        }
        const textAfter = part.text.substring(lastIndex);
        if (textAfter) {
          boldParts.push({ text: textAfter });
        }
      });
      parts = boldParts;

      // Parse Italic: *text* or _text_ (excluding double asterisks)
      const italicRegex = /(\*|_)(.*?)\1/g;
      let italicParts: typeof parts = [];
      parts.forEach(part => {
        if (part.isBold || part.isItalic) {
          italicParts.push(part);
          return;
        }
        let lastIndex = 0;
        let match;
        italicRegex.lastIndex = 0;
        while ((match = italicRegex.exec(part.text)) !== null) {
          const textBefore = part.text.substring(lastIndex, match.index);
          if (textBefore) {
            italicParts.push({ text: textBefore });
          }
          italicParts.push({ text: match[2], isItalic: true });
          lastIndex = italicRegex.lastIndex;
        }
        const textAfter = part.text.substring(lastIndex);
        if (textAfter) {
          italicParts.push({ text: textAfter });
        }
      });
      parts = italicParts;

      return parts.map((part, index) => {
        let element: React.ReactNode = part.text;
        if (part.isBold) {
          element = <strong key={index} className="text-zinc-150 font-bold">{element}</strong>;
        }
        if (part.isItalic) {
          element = <em key={index} className="text-zinc-200 italic">{element}</em>;
        }
        return element;
      });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed === "---" || trimmed === "___" || trimmed === "***") {
        pushList();
        elements.push(<hr key={index} className="border-zinc-900 my-5" />);
        return;
      }

      if (!trimmed) {
        pushList();
        return;
      }

      if (trimmed.startsWith("####")) {
        pushList();
        elements.push(
          <h4 key={index} className="text-sm font-bold text-indigo-400 mt-4 mb-2">
            {parseInlineStyles(trimmed.replace("####", "").trim())}
          </h4>
        );
      } else if (trimmed.startsWith("###")) {
        pushList();
        elements.push(
          <h3 key={index} className="text-base font-bold text-indigo-400 mt-6 mb-3 border-b border-zinc-900 pb-1.5">
            {parseInlineStyles(trimmed.replace("###", "").trim())}
          </h3>
        );
      } else if (trimmed.startsWith("##")) {
        pushList();
        elements.push(
          <h2 key={index} className="text-lg font-bold text-indigo-400 mt-6 mb-3 border-b border-zinc-900 pb-2">
            {parseInlineStyles(trimmed.replace("##", "").trim())}
          </h2>
        );
      } else if (trimmed.startsWith("#")) {
        pushList();
        elements.push(
          <h1 key={index} className="text-xl font-extrabold text-indigo-400 mt-6 mb-3 border-b border-zinc-900 pb-2">
            {parseInlineStyles(trimmed.replace("#", "").trim())}
          </h1>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const cleanText = trimmed.replace(/^[-*]\s+/, "");
        listItems.push(
          <li key={index} className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
            <ChevronRight className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>{parseInlineStyles(cleanText)}</span>
          </li>
        );
      } else if (/^\d+\.\s+/.test(trimmed)) {
        const cleanText = trimmed.replace(/^\d+\.\s+/, "");
        const numMatch = trimmed.match(/^(\d+)\.\s+/);
        const numStr = numMatch ? numMatch[1] : "1";
        listItems.push(
          <li key={index} className="flex items-start gap-2 text-zinc-300 text-sm leading-relaxed">
            <span className="text-indigo-400 font-bold text-xs shrink-0 w-5 text-right mt-0.5">{numStr}.</span>
            <span>{parseInlineStyles(cleanText)}</span>
          </li>
        );
      } else {
        pushList();
        elements.push(
          <p key={index} className="text-zinc-300 text-sm leading-relaxed mb-4">
            {parseInlineStyles(line)}
          </p>
        );
      }
    });

    pushList();
    return <div className="prose prose-invert max-w-none">{elements}</div>;
  };

  const renderActiveSection = () => {
    if (!blueprint) return <div className="text-zinc-500 text-sm">No analysis content available.</div>;
    const content = blueprint[activeTab as keyof Blueprint] || "Generating content details...";
    return <MarkdownRenderer content={content} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 text-indigo-500 animate-spin" />
        <span className="text-zinc-500 text-sm font-semibold">Configuring Workspace...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold">Workspace Not Found</h3>
        <p className="text-zinc-500 text-sm mt-1 mb-6">The workspace you are trying to view does not exist or you lack authorization access.</p>
        <Link href="/dashboard" className="px-5 py-2.5 bg-zinc-900 rounded-xl text-zinc-200 border border-zinc-800 text-sm font-semibold hover:bg-zinc-800 hover:text-white transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white overflow-hidden h-screen">
      {/* Workspace Header */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="h-9 w-9 border border-zinc-850 hover:border-zinc-700 bg-zinc-900/40 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-base tracking-tight text-zinc-200">{project.title}</h1>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
              project.status === "completed" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : project.status === "generating"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
            }`}>
              {project.status === "completed" ? "Blueprint Locked" : project.status === "generating" ? "Analyzing..." : "Pending Blueprint"}
            </span>
          </div>
        </div>

        {project.status === "completed" && (
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-xl border border-zinc-850 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 text-zinc-400 text-xs font-semibold flex items-center gap-1.5 transition-all">
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
          </div>
        )}
      </header>

      {/* Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {project.status === "pending" || project.status === "generating" ? (
          /* EMPTY STATE GENERATOR CONTAINER */
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950/20 overflow-y-auto">
            {error && (
              <div className="max-w-xl w-full mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!generating ? (
              <div className="max-w-2xl text-center border border-zinc-900 bg-zinc-900/10 rounded-2xl p-10 shadow-2xl relative backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl pointer-events-none"></div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6 mx-auto">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Generate Startup Blueprint</h2>
                <p className="text-zinc-500 text-sm mt-2 mb-8 max-w-lg mx-auto leading-relaxed">
                  Analyze feasibility, compile financial benchmarks, search for direct competitors, and formulate a full launch roadmap for **{project.title}**. This is a one-time automated workflow.
                </p>

                <button
                  onClick={handleGenerateBlueprint}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-505 px-8 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Play className="h-4.5 w-4.5" />
                  Trigger Blueprint Agent Engine
                </button>
              </div>
            ) : (
              /* REAL TIME SSE CHECKLIST STREAMING */
              <div className="max-w-lg w-full border border-zinc-900 bg-zinc-950 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-base font-bold text-zinc-200 mb-2 flex items-center gap-2">
                  <Loader2 className="h-4.5 w-4.5 text-indigo-500 animate-spin" />
                  Generating Blueprint Sections...
                </h3>
                <p className="text-zinc-500 text-xs mb-6">Running analysis agents. Real-world parameters are being calculated.</p>

                <div className="space-y-3.5 border-t border-zinc-900 pt-4">
                  {genSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        step.status === "completed" 
                          ? "text-zinc-200" 
                          : step.status === "running"
                          ? "text-indigo-400 font-bold"
                          : "text-zinc-600"
                      }`}>
                        {step.name}
                      </span>
                      <div>
                        {step.status === "completed" ? (
                          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Ready
                          </span>
                        ) : step.status === "running" ? (
                          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-700">Waiting...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* WORKSPACE VIEW: NAV SIDEBAR + MAIN CONTENT AREA + CHAT SIDEBAR */
          <>
            {/* Left Workspace Panel Navigation */}
            <div className="w-64 border-r border-zinc-900 bg-zinc-950 p-4 flex flex-col gap-1.5 shrink-0 select-none overflow-y-auto">
              <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Sections</div>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-zinc-100 border-l-2 border-indigo-500 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${activeTab === tab.id ? "text-indigo-400" : "text-zinc-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-zinc-950/20">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 border-b border-zinc-900 pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-zinc-500 text-xs mt-1">Detailed strategic report generated on your business idea</p>
                  </div>
                </div>
                {renderActiveSection()}
              </div>
            </div>

            {/* Right Chat Sidebar */}
            <div className="w-80 border-l border-zinc-900 bg-zinc-950 flex flex-col justify-between shrink-0 overflow-hidden h-full">
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-900 flex items-center gap-2 bg-zinc-950 shrink-0">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-400" />
                <span className="text-xs font-bold text-zinc-200">AI Strategy Assistant</span>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Bot className="h-10 w-10 text-zinc-800 mx-auto mb-3" />
                    <div className="text-xs font-bold text-zinc-400">Ask strategic questions</div>
                    <p className="text-zinc-600 text-[10px] mt-1 max-w-[180px] mx-auto leading-relaxed">
                      Ask questions about competitor pricing strategies, technical hurdles, or marketing blueprints.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 text-xs leading-relaxed max-w-[85%] ${
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center shadow ${
                        msg.role === "user" 
                          ? "bg-zinc-800 text-zinc-200" 
                          : "bg-indigo-600 text-white"
                      }`}>
                        {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                      </div>
                      
                      <div className={`p-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-indigo-650/15 border border-indigo-500/10 text-zinc-200 rounded-tr-none"
                          : "bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-850"
                      }`}>
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex gap-3 text-xs text-zinc-500">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white shrink-0 flex items-center justify-center shadow">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="bg-zinc-900 border border-zinc-850 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                      <span>Formulating advice...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-zinc-950 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ask about your business..."
                    className="w-full h-10 bg-zinc-900/60 border border-zinc-900 rounded-xl pl-4 pr-10 text-xs focus:border-indigo-500 transition-all outline-none text-zinc-200"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-505 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
