import React from "react";
import { GraduationCap, Award, BookOpen, Database, Sparkles, Terminal, Code2, Cpu } from "lucide-react";

export default function AboutView() {
  const coreFeatures = [
    {
      title: "HR Interview Prep",
      description: "Generates custom behavioral and qualitative interview questions relevant to your job role with strategic answering advice.",
      icon: <Award className="h-5 w-5 text-indigo-600" />
    },
    {
      title: "Technical Q&A Core",
      description: "Provides concept-clearing technical interview questions and sample answers targeting the focus domain and programming language.",
      icon: <Code2 className="h-5 w-5 text-indigo-600" />
    },
    {
      title: "Coding Lab Boilerplates",
      description: "Creates coding challenges customized for your difficulty level, with specific input/output test parameters and starter code templates.",
      icon: <Terminal className="h-5 w-5 text-indigo-600" />
    },
    {
      title: "Aptitude Assessments",
      description: "Assembles logical, verbal, or quantitative multiple-choice assessments with interactive evaluations and step-by-step mathematical solutions.",
      icon: <Cpu className="h-5 w-5 text-indigo-600" />
    }
  ];

  return (
    <div className="space-y-8" id="about-view-container">
      {/* Title block */}
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          About AI Placement Prep Agent
        </h2>
        <p className="text-sm text-slate-500">Learn about the design, capabilities, and underlying full-stack technologies of this agent.</p>
      </div>

      {/* Grid of details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-sans font-black text-slate-800 text-lg">Goal & Purpose</h3>
          <p className="text-sm leading-relaxed text-slate-600">
            The **AI Placement Preparation Agent** is an intelligent assistant designed to streamline campus recruitment training. Preparing for placements is traditionally fragmented—requiring students to browse separate websites for aptitude tests, coding problems, technical theory, and behavioral tips.
          </p>
          <p className="text-sm leading-relaxed text-slate-600">
            By leveraging advanced AI capabilities from Google Gemini, this application creates cohesive, personalized, and domain-targeted preparation kits in seconds. It bridges student information (job role, language, topic) directly with industry-standard expectations.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-50 bg-indigo-50/20 p-6 flex flex-col justify-between">
          <div>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              Under the Hood
            </span>
            <h4 className="mt-2 text-lg font-black text-indigo-900">Advanced AI Synergy</h4>
            <p className="mt-2 text-xs leading-relaxed text-indigo-950/70">
              The application utilizes the modern <strong>@google/genai SDK</strong> server-side with the ultra-fast <strong>gemini-3.5-flash</strong> model. By supplying a precise output schema, the agent generates 100% structured JSON payloads. This guarantees that technical code, quantitative aptitude formulas, and vertical milestones render with perfect layout integrity.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Powered by Gemini 3.5 Flash
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="space-y-4 pt-4">
        <h3 className="font-sans font-black text-slate-800 text-lg">Key Deliverables</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {coreFeatures.map((feat) => (
            <div key={feat.title} className="flex gap-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-200">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-slate-900 text-base">{feat.title}</h4>
                <p className="text-xs leading-relaxed text-slate-500">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="font-sans font-black text-slate-800 text-lg flex items-center gap-2">
          <Database className="h-5 w-5 text-indigo-600" />
          Twin Stack Specifications
        </h3>
        
        <p className="text-xs text-slate-500">
          This project is built as a highly portable dual-stack asset. A lightweight React & Express architecture powers the active live preview sandbox, while a production-grade Maven & Spring Boot 3.5 architecture is crafted for deployment.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 pt-2">
          {/* Active Preview Stack */}
          <div className="space-y-3 border-r border-slate-100 pr-0 sm:pr-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Sandbox Stack (Node.js)</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Frontend:</strong> React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Backend Proxy:</strong> Express, Node.js, @google/genai SDK
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Data Persistence:</strong> Server-side Durable Local File Storage
              </li>
            </ul>
          </div>

          {/* Spring Boot Deployment Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Production Deploy Stack (Spring Boot)</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Backend Framework:</strong> Spring Boot 3.5 (Java 21, Maven)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Database Core:</strong> Spring Data MongoDB (MongoDB Atlas Integration)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                <strong>Cloud Readiness:</strong> Docker Container, Spring Web Security, Global Exceptions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
