"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Plus, Compass, LogOut, Trash2, Edit3, Search, Folder, 
  Clock, Loader2, AlertCircle, Sparkles, X, ChevronRight 
} from "lucide-react";
import { API_BASE_URL } from "@/lib/config";
import { DEMO_PROJECT } from "@/lib/demoData";

interface Project {
  id: number;
  title: string;
  business_idea: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Project Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIdea, setNewIdea] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Rename Project State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  const [userName, setUserName] = useState("User");

  // Fetch current user and projects on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user info
        const userResp = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResp.status === 401) {
          handleLogout();
          return;
        }
        if (userResp.ok) {
          const userData = await userResp.json();
          setUserName(userData.name);
        }

        // Fetch projects
        const projResp = await fetch(`${API_BASE_URL}/api/v1/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (projResp.ok) {
          const projData = await projResp.json();
          setProjects(projData.length > 0 ? projData : [
            {
              id: "demo" as any,
              title: DEMO_PROJECT.title,
              business_idea: DEMO_PROJECT.business_idea,
              status: "completed",
              created_at: DEMO_PROJECT.created_at
            }
          ]);
        } else {
          throw new Error("Failed to load projects.");
        }
      } catch (err: any) {
        console.warn("Backend unavailable, loading offline dashboard mode:", err);
        setUserName("Demo Explorer");
        setProjects([
          {
            id: "demo" as any,
            title: DEMO_PROJECT.title,
            business_idea: DEMO_PROJECT.business_idea,
            status: "completed",
            created_at: DEMO_PROJECT.created_at
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIdea.trim()) return;

    setCreateLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, business_idea: newIdea })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to create project.");
      }

      const created = await response.json();
      setProjects([created, ...projects]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewIdea("");

      // Redirect to the newly created project workspace
      router.push(`/projects/${created.id}`);
    } catch (err: any) {
      console.warn("Using offline simulated project:", err);
      setIsModalOpen(false);
      router.push("/projects/demo");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project? All associated blueprint data and chat histories will be permanently removed.")) return;
    
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to delete project.");

      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      setError(err.message || "Could not delete project.");
    }
  };

  const handleRenameProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editTitle.trim()) return;

    setRenameLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle })
      });

      if (!response.ok) throw new Error("Failed to rename project.");

      const updated = await response.json();
      setProjects(projects.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null);
      setEditTitle("");
    } catch (err: any) {
      setError(err.message || "Could not rename project.");
    } finally {
      setRenameLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.business_idea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            AI Business Architect
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-zinc-400">
            Welcome, <span className="text-zinc-200 font-bold">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="h-8 px-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Workspaces</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage and explore your startup blueprints</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-505 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            <Plus className="h-4.5 w-4.5" />
            New Startup Project
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Statistics */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search workspaces by title or idea..."
              className="w-full h-11 bg-zinc-900/30 border border-zinc-900 rounded-xl pl-11 pr-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Panel */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <span className="text-zinc-500 text-sm">Loading projects...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="border border-zinc-900/60 bg-zinc-900/10 rounded-2xl p-16 text-center max-w-2xl mx-auto mt-8">
            <Folder className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-300">No Projects Found</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-md mx-auto mb-6">
              {searchQuery ? "No workspace matches your search criteria." : "Create your first startup project workspace to generate blueprints and access real-world competitors."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-750 hover:bg-zinc-750 hover:text-white transition-all text-sm font-semibold"
              >
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Initialize Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="group border border-zinc-900 bg-zinc-900/20 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-800 hover:bg-zinc-900/30 transition-all duration-200 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setEditTitle(project.title);
                        }}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850"
                        title="Rename"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-850"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3 mb-6">
                    {project.business_idea}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
                  >
                    Open Workspace
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-200 mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              New Startup Project
            </h3>
            <p className="text-zinc-500 text-xs mb-6">Set up your startup idea to launch a blueprint analysis</p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400" htmlFor="projectTitle">
                  Project Title
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  required
                  placeholder="e.g. AI Recruitment Platform"
                  className="w-full h-10 bg-zinc-950 border border-zinc-850 rounded-xl px-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400" htmlFor="businessIdea">
                  Business Idea / Concept
                </label>
                <textarea
                  id="businessIdea"
                  required
                  rows={4}
                  placeholder="Explain your business idea in detail: what problem does it solve, what is the core mechanism, who is the customer..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none resize-none"
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-10 rounded-xl border border-zinc-850 bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-505 text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  {createLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Initialize Workspace"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-zinc-200 mb-6">Rename Project</h3>

            <form onSubmit={handleRenameProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400" htmlFor="editTitle">
                  Project Title
                </label>
                <input
                  id="editTitle"
                  type="text"
                  required
                  className="w-full h-10 bg-zinc-950 border border-zinc-850 rounded-xl px-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 h-10 rounded-xl border border-zinc-850 bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renameLoading}
                  className="px-5 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                >
                  {renameLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Renaming...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
