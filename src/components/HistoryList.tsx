import React, { useState } from "react";
import { History, Calendar, Trash2, ArrowRight, User, Briefcase, Code, BookOpen, Search, AlertCircle } from "lucide-react";
import { PreparationRecord } from "../types";

interface HistoryListProps {
  history: PreparationRecord[];
  onSelect: (record: PreparationRecord) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function HistoryList({ history, onSelect, onDelete, isLoading }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) => {
    const searchString = `${item.studentName} ${item.jobRole} ${item.programmingLanguage} ${item.topic}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6" id="history-list-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Preparation History Log
          </h2>
          <p className="text-sm text-slate-500">Access and manage all previously generated AI campus placement preparation plans.</p>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, role, language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
          <p className="mt-3.5 text-sm font-semibold text-slate-500">Retrieving records from the archive...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
          <History className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 font-sans font-bold text-slate-800 text-lg">No Plans Generated Yet</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">Configure parameters in the Generator tab to compose customized placement preparation material and roadmaps.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 font-sans font-bold text-slate-800 text-base">No Matching Records Found</h3>
          <p className="mt-1 text-sm text-slate-500">Try modifying your search query to find the desired records.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredHistory.map((item) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition duration-200 hover:border-indigo-300 hover:shadow-md"
              id={`history-item-${item.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-slate-900 text-base">{item.studentName}</h4>
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(item.createdDate)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    id={`btn-delete-history-${item.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition duration-150"
                    title="Delete record"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-600">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{item.jobRole}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-600">
                    <Code className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono font-medium">{item.programmingLanguage}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-600">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">Topic: {item.topic}</span>
                  </div>
                </div>
              </div>

              {/* Footer View Trigger */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  item.difficultyLevel === "Easy" ? "bg-green-50 text-green-700" : item.difficultyLevel === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                }`}>
                  {item.difficultyLevel} Level
                </span>

                <button
                  onClick={() => onSelect(item)}
                  id={`btn-view-plan-${item.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition group-hover:text-indigo-800"
                >
                  Inspect Plan
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
