import React from "react";
import { GraduationCap, History, Info, Sparkles } from "lucide-react";

interface NavBarProps {
  currentView: "home" | "history" | "about";
  onViewChange: (view: "home" | "history" | "about") => void;
  historyCount: number;
}

export default function NavBar({ currentView, onViewChange, historyCount }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          onClick={() => onViewChange("home")} 
          className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-slate-900 text-base sm:text-lg">
              AI Placement Prep
            </h1>
            <p className="font-mono text-[10px] font-semibold text-indigo-600 uppercase tracking-widest leading-none">
              Trainer Agent
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-btn-home"
            onClick={() => onViewChange("home")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              currentView === "home"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Generator</span>
          </button>

          <button
            id="nav-btn-history"
            onClick={() => onViewChange("history")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              currentView === "history"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="relative">
              <History className="h-4 w-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                  {historyCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            id="nav-btn-about"
            onClick={() => onViewChange("about")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              currentView === "about"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
