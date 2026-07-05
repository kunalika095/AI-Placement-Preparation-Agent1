import React, { useState } from "react";
import { Sparkles, Trash2, History, User, Briefcase, Code, BookOpen, BarChart } from "lucide-react";
import { PreparationPlanInput } from "../types";

interface PreparationFormProps {
  onGenerate: (input: PreparationPlanInput) => void;
  onViewHistory: () => void;
  isLoading: boolean;
}

const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer"
];

const LANGUAGES = [
  "Java",
  "Python",
  "C++",
  "JavaScript",
  "TypeScript",
  "SQL",
  "Go"
];

const TOPICS = [
  "Data Structures",
  "Algorithms",
  "Object Oriented Programming (OOPs)",
  "Database Management Systems (DBMS)",
  "System Design",
  "Operating Systems",
  "Computer Networks"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function PreparationForm({ onGenerate, onViewHistory, isLoading }: PreparationFormProps) {
  const [studentName, setStudentName] = useState("");
  const [jobRole, setJobRole] = useState(JOB_ROLES[0]);
  const [customJobRole, setCustomJobRole] = useState("");
  const [useCustomJobRole, setUseCustomJobRole] = useState(false);

  const [programmingLanguage, setProgrammingLanguage] = useState(LANGUAGES[0]);
  const [customLanguage, setCustomLanguage] = useState("");
  const [useCustomLanguage, setUseCustomLanguage] = useState(false);

  const [topic, setTopic] = useState(TOPICS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [useCustomTopic, setUseCustomTopic] = useState(false);

  const [difficultyLevel, setDifficultyLevel] = useState("Medium");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClear = () => {
    setStudentName("");
    setJobRole(JOB_ROLES[0]);
    setCustomJobRole("");
    setUseCustomJobRole(false);
    setProgrammingLanguage(LANGUAGES[0]);
    setCustomLanguage("");
    setUseCustomLanguage(false);
    setTopic(TOPICS[0]);
    setCustomTopic("");
    setUseCustomTopic(false);
    setDifficultyLevel("Medium");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    if (!studentName.trim()) {
      validationErrors.studentName = "Student name is required";
    }

    const finalJobRole = useCustomJobRole ? customJobRole : jobRole;
    if (!finalJobRole.trim()) {
      validationErrors.jobRole = "Job role is required";
    }

    const finalLanguage = useCustomLanguage ? customLanguage : programmingLanguage;
    if (!finalLanguage.trim()) {
      validationErrors.programmingLanguage = "Programming language is required";
    }

    const finalTopic = useCustomTopic ? customTopic : topic;
    if (!finalTopic.trim()) {
      validationErrors.topic = "Preparation topic is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onGenerate({
      studentName: studentName.trim(),
      jobRole: finalJobRole.trim(),
      programmingLanguage: finalLanguage.trim(),
      topic: finalTopic.trim(),
      difficultyLevel
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" id="prep-form-container">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Configure Placement Blueprint</h2>
        <p className="text-sm text-slate-500">Provide details below to trigger Gemini AI and assemble custom HR, Technical, Coding, and Aptitude prep kits.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700" htmlFor="studentName">
            <User className="h-4 w-4 text-slate-400" />
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              if (errors.studentName) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.studentName;
                  return copy;
                });
              }
            }}
            placeholder="Enter student name"
            className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
              errors.studentName ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
            }`}
          />
          {errors.studentName && <p className="text-xs font-medium text-red-500">{errors.studentName}</p>}
        </div>

        {/* Job Role Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Briefcase className="h-4 w-4 text-slate-400" />
              Target Job Role <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseCustomJobRole(!useCustomJobRole)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              {useCustomJobRole ? "Choose Preset" : "Write Custom"}
            </button>
          </div>

          {useCustomJobRole ? (
            <input
              type="text"
              id="customJobRole"
              value={customJobRole}
              onChange={(e) => {
                setCustomJobRole(e.target.value);
                if (errors.jobRole) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.jobRole;
                    return copy;
                  });
                }
              }}
              placeholder="E.g., Cybersecurity Analyst, Embedded Developer"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
                errors.jobRole ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
              }`}
            />
          ) : (
            <select
              id="jobRole"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          )}
          {errors.jobRole && <p className="text-xs font-medium text-red-500">{errors.jobRole}</p>}
        </div>

        {/* Programming Language Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Code className="h-4 w-4 text-slate-400" />
              Programming Language <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseCustomLanguage(!useCustomLanguage)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              {useCustomLanguage ? "Choose Preset" : "Write Custom"}
            </button>
          </div>

          {useCustomLanguage ? (
            <input
              type="text"
              id="customProgrammingLanguage"
              value={customLanguage}
              onChange={(e) => {
                setCustomLanguage(e.target.value);
                if (errors.programmingLanguage) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.programmingLanguage;
                    return copy;
                  });
                }
              }}
              placeholder="E.g., Kotlin, Rust, Swift"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
                errors.programmingLanguage ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
              }`}
            />
          ) : (
            <select
              id="programmingLanguage"
              value={programmingLanguage}
              onChange={(e) => setProgrammingLanguage(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          )}
          {errors.programmingLanguage && <p className="text-xs font-medium text-red-500">{errors.programmingLanguage}</p>}
        </div>

        {/* Topic Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <BookOpen className="h-4 w-4 text-slate-400" />
              Focus Preparation Topic <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setUseCustomTopic(!useCustomTopic)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              {useCustomTopic ? "Choose Preset" : "Write Custom"}
            </button>
          </div>

          {useCustomTopic ? (
            <input
              type="text"
              id="customTopic"
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                if (errors.topic) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.topic;
                    return copy;
                  });
                }
              }}
              placeholder="E.g., Tree Traversals, SQL Joins, Concurrency"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
                errors.topic ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-slate-300"
              }`}
            />
          ) : (
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {TOPICS.map((top) => (
                <option key={top} value={top}>{top}</option>
              ))}
            </select>
          )}
          {errors.topic && <p className="text-xs font-medium text-red-500">{errors.topic}</p>}
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <BarChart className="h-4 w-4 text-slate-400" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                id={`diff-btn-${diff.toLowerCase()}`}
                onClick={() => setDifficultyLevel(diff)}
                className={`flex items-center justify-center rounded-lg border py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                  difficultyLevel === diff
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            id="btn-generate-plan"
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition duration-200 hover:from-indigo-700 hover:to-violet-700 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-75"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? "Generating Prep Plan..." : "Generate Preparation Plan"}
          </button>

          <button
            type="button"
            id="btn-clear-form"
            onClick={handleClear}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>

          <button
            type="button"
            id="btn-view-history-form"
            onClick={onViewHistory}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
          >
            <History className="h-4 w-4" />
            History
          </button>
        </div>
      </form>
    </div>
  );
}
