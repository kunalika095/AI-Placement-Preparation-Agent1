import React, { useState, useEffect } from "react";
import { GraduationCap, Sparkles, AlertCircle, RefreshCw, Layers } from "lucide-react";
import NavBar from "./components/NavBar";
import PreparationForm from "./components/PreparationForm";
import ResultView from "./components/ResultView";
import HistoryList from "./components/HistoryList";
import AboutView from "./components/AboutView";
import { PreparationPlanInput, PreparationRecord } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "history" | "about">("home");
  const [activeRecord, setActiveRecord] = useState<PreparationRecord | null>(null);
  const [history, setHistory] = useState<PreparationRecord[]>([]);
  
  // Loading and Error states
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Animated loader message rotation state
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);

  const loaderMessages = [
    "Establishing handshake with Google Gemini AI...",
    "Analyzing target job role competencies & requirements...",
    "Curating behavioral HR interview questions & response advice...",
    "Assembling core technical question banks & concept keys...",
    "Writing custom programming challenge specs & code stubs...",
    "Compiling campus-level aptitude tests with complete explanations...",
    "Tailoring your step-by-step master roadmap & expert study tips..."
  ];

  // Fetch History on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Interval timer for rotating loader messages
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoaderMessageIndex((prev) => (prev + 1) % loaderMessages.length);
      }, 3500);
    } else {
      setLoaderMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/preparation/history");
      if (!res.ok) {
        throw new Error("Failed to load history list.");
      }
      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Unable to establish connection with the history archive.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGeneratePlan = async (input: PreparationPlanInput) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setActiveRecord(null);
    try {
      const res = await fetch("/api/preparation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation endpoint returned a bad status.");
      }

      // Success! Update local states
      setActiveRecord(data);
      setHistory((prev) => [data, ...prev]);
      setCurrentView("home");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred while processing the placement agent generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/preparation/history/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unable to delete history item.");
      }

      // Update local history
      setHistory((prev) => prev.filter((item) => item.id !== id));
      
      // If we are currently viewing the deleted record, close it
      if (activeRecord && activeRecord.id === id) {
        setActiveRecord(null);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while deleting the preparation record.");
    }
  };

  const handleViewRecord = (record: PreparationRecord) => {
    setActiveRecord(record);
    setCurrentView("home"); // Render result component on Home screen
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <NavBar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          if (view !== "home") {
            setActiveRecord(null); // Reset detail view when navigating away
          }
        }} 
        historyCount={history.length}
      />

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Callout */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 shadow-sm" id="error-alert-banner">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-sans font-bold text-red-800 text-sm">System Alert</h4>
              <p className="mt-1 text-xs text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-xs font-bold text-red-800 hover:text-red-950 px-2 py-0.5 rounded hover:bg-red-100 transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING BACKDROP (GENERATING NEW PLAN) */}
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-2xl mx-auto space-y-8" id="loading-animation-backdrop">
            {/* Spinning futuristic loader */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-dashed border-indigo-600"></div>
              <div className="absolute inset-2 animate-ping rounded-full border-2 border-indigo-200"></div>
              <div className="absolute inset-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-indigo-600 leading-none">
                <Sparkles className="h-3 w-3 animate-pulse" /> Gemini AI Core Engaged
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Composing Preparation Blueprint</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">This takes about 20-30 seconds as Gemini generates customized multi-part placement material containing real codes, aptitude formulas, and vertical roadmaps.</p>
            </div>

            {/* Rotating message indicator */}
            <div className="rounded-xl border border-slate-100 bg-white px-5 py-3.5 shadow-sm inline-flex items-center gap-2.5 max-w-md w-full justify-center">
              <RefreshCw className="h-4.5 w-4.5 animate-spin text-indigo-500 shrink-0" />
              <p className="font-mono text-xs font-semibold text-slate-700 leading-snug text-left truncate">
                {loaderMessages[loaderMessageIndex]}
              </p>
            </div>
          </div>
        ) : (
          /* ROUTED PANELS */
          <div className="transition-all duration-300">
            {currentView === "home" && (
              <div>
                {activeRecord ? (
                  <ResultView 
                    record={activeRecord} 
                    onBack={() => {
                      setActiveRecord(null);
                      fetchHistory(); // Sync changes
                    }} 
                  />
                ) : (
                  <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Hero Title Left column */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                      <div className="space-y-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 uppercase tracking-widest leading-none">
                          <Layers className="h-3 w-3" /> Campus Placement Prep
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                          AI Placement <br />
                          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Preparation Agent
                          </span>
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                          Empower your recruitment readiness. Configure student profiles to invoke Gemini AI and extract high-caliber, tailor-made study kits, coding challenge boilerplates, and step-by-step master roadmaps.
                        </p>
                      </div>

                      {/* Fast statistics summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                          <span className="font-mono text-3xl font-black text-indigo-600">
                            {history.length}
                          </span>
                          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Saved Prep Blueprints</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                          <span className="font-mono text-3xl font-black text-indigo-600">
                            100%
                          </span>
                          <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">Gemini Tailored</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Form Right column */}
                    <div className="lg:col-span-7">
                      <PreparationForm 
                        onGenerate={handleGeneratePlan} 
                        onViewHistory={() => setCurrentView("history")}
                        isLoading={isGenerating}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === "history" && (
              <HistoryList 
                history={history} 
                onSelect={handleViewRecord} 
                onDelete={handleDeleteRecord}
                isLoading={isLoadingHistory}
              />
            )}

            {currentView === "about" && (
              <AboutView />
            )}
          </div>
        )}
      </main>

      {/* Minimal clean footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 AI Placement Preparation Agent. Built with Google Gemini & Express + React.
          </p>
          <p className="font-mono text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
            Secure Full-Stack Cloud Run Environment
          </p>
        </div>
      </footer>
    </div>
  );
}

