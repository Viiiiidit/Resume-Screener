"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CandidateScreeningResult } from "@/types/candidate";
import {
  UploadCloud,
  FileCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
  Zap,
  RotateCcw,
  Download,
  Terminal,
} from "lucide-react";

const PRESET_DESCRIPTIONS = [
  {
    title: "Python Backend Lead",
    content:
      "Seeking a Senior Python Backend Engineer with 5+ years of experience. Mandatory expertise in Python, FastAPI, Docker, PostgreSQL, and distributed async microservices architecture. Strong background in system design, CI/CD pipelines, and high-concurrency RESTful APIs.",
  },
  {
    title: "Full-Stack Engineer",
    content:
      "Looking for a Full-Stack Engineer skilled in TypeScript, Next.js, React, Node.js, and Tailwind CSS. Experience with PostgreSQL, Prisma ORM, state management, and modern cloud deployment architectures.",
  },
  {
    title: "AI / ML Engineer",
    content:
      "Seeking an applied AI / ML Engineer with hands-on experience in LLM integration, prompt engineering, vector databases (Pinecone/Qdrant), Python, PyTorch, and deploying production RAG pipelines.",
  },
];

export default function SolutionsPage() {
  // 1. Local State Management
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumes, setResumes] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<CandidateScreeningResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set([0]));
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File size formatter
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Validate and stage PDF files
  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validPdfs: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(incomingFiles).forEach((file) => {
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        const isDuplicate = resumes.some(
          (existing) => existing.name === file.name && existing.size === file.size
        );
        if (!isDuplicate) {
          validPdfs.push(file);
        }
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(`UNSUPPORTED FILE FORMAT: ${invalidFiles.join(", ")}. ONLY PDF FILES ARE ACCEPTED.`);
    }

    if (validPdfs.length > 0) {
      setResumes((prev) => [...prev, ...validPdfs]);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setResumes((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearFiles = () => {
    setResumes([]);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleReset = () => {
    setCandidates([]);
    setErrorMessage(null);
  };

  const exportResultsJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(candidates, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ranked_candidates.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 4. API Integration: Send multipart/form-data to POST /api/rank-resumes
  const handleAnalyze = async () => {
    if (!jobDescription.trim() || resumes.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const formData = new FormData();
      formData.append("job_requirements", jobDescription.trim());

      resumes.forEach((file) => {
        formData.append("resumes", file, file.name);
      });

      const response = await fetch(`${backendUrl}/api/rank-resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errText = `HTTP Error ${response.status}`;
        try {
          const jsonErr = await response.json();
          if (jsonErr.detail) {
            errText =
              typeof jsonErr.detail === "string"
                ? jsonErr.detail
                : JSON.stringify(jsonErr.detail);
          }
        } catch {
          const text = await response.text();
          if (text) errText = text;
        }
        throw new Error(errText);
      }

      const data: CandidateScreeningResult[] = await response.json();
      setCandidates(data);
      // Auto-expand all candidates or first candidate
      setExpandedIndices(new Set([0]));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to screening service.";
      setErrorMessage(
        msg.includes("Failed to fetch") || msg.includes("NetworkError")
          ? "Could not connect to FastAPI service at http://localhost:8000. Verify the backend server is running."
          : msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isReadyToAnalyze = jobDescription.trim().length > 0 && resumes.length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#FF5050] selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container: min-h-screen bg-black pt-24 px-8 */}
      <main className="flex-1 w-full min-h-screen bg-black pt-24 px-4 sm:px-8 pb-24 max-w-7xl mx-auto space-y-12">
        {/* Header Title Banner */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#FF5050] bg-black/60 px-3 py-1 border border-[#FF5050]/40">
            <span className="w-2 h-2 bg-[#FF5050] rotate-45" />
            <span>VISTA.IO • AI SCREENING ENGINE</span>
          </div>
          <h1 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl tracking-tighter text-white uppercase leading-[0.92]">
            AI Resume Screener
          </h1>
          <p className="font-mono text-xs sm:text-sm text-gray-300 uppercase tracking-widest leading-relaxed max-w-3xl">
            Input target job specifications and stage PDF dossiers for autonomous neural candidate rank-ordering.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            id="api-error-banner"
            className="p-5 bg-black border border-[#FF5050] text-[#FF8585] font-mono text-xs flex items-start space-x-3 shadow-2xl animate-fadeIn"
          >
            <AlertCircle className="w-5 h-5 text-[#FF5050] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-[#FF5050] uppercase tracking-wider">
                // PROTOCOL ERROR
              </p>
              <p className="mt-1 font-sans text-xs leading-relaxed text-gray-300">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={handleAnalyze}
                className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FF5050] text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e64040] transition-colors rounded-none cursor-pointer"
              >
                <span>Retry Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 1: Inputs (Grid of 2 distinct dark olive-green cards: bg-[#3B403D] with white text) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Job Description Textarea */}
          <div className="bg-[#3B403D] text-white border border-white/10 p-8 rounded-none shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <label
                  htmlFor="job-description-textarea"
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
                  <span className="font-mono text-base uppercase font-bold text-white tracking-widest">
                    1. Enter Job Requirements
                  </span>
                </label>

                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => setJobDescription("")}
                    className="font-mono text-xs uppercase tracking-wider text-gray-300 hover:text-[#FF5050] transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2 font-mono text-xs uppercase tracking-wider text-gray-300">
                  <Terminal className="w-3.5 h-3.5 text-[#FF5050]" />
                  <span>Preset Templates:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_DESCRIPTIONS.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => setJobDescription(preset.content)}
                      className="font-mono text-xs px-3 py-1.5 rounded-none bg-black/50 hover:bg-black/80 hover:border-[#FF5050] border border-white/15 text-white uppercase tracking-wider transition-all cursor-pointer"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Textarea */}
              <textarea
                id="job-description-textarea"
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description, required experience, skill matrix, and qualification benchmarks here..."
                className="w-full bg-black/70 border border-white/15 focus:border-[#FF5050] focus:ring-1 focus:ring-[#FF5050] p-4 font-mono text-xs text-white placeholder:text-gray-500 focus:outline-none transition-all resize-y min-h-[180px] leading-relaxed rounded-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-gray-300 uppercase tracking-wider pt-2 border-t border-white/10">
              <span>{jobDescription.length} Characters</span>
              <span className="text-[#FF5050] font-bold">
                {jobDescription.trim() ? "READY" : "AWAITING INPUT"}
              </span>
            </div>
          </div>

          {/* Card 2: PDF File Upload Dropzone */}
          <div className="bg-[#3B403D] text-white border border-white/10 p-8 rounded-none shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
                  <span className="font-mono text-base uppercase font-bold text-white tracking-widest">
                    2. Upload Applicant Resumes (PDFs)
                  </span>
                </div>

                {resumes.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearFiles}
                    className="font-mono text-xs uppercase tracking-wider text-gray-300 hover:text-[#FF5050] transition-colors cursor-pointer"
                  >
                    Flush ({resumes.length})
                  </button>
                )}
              </div>

              {/* Hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 rounded-none select-none ${
                  isDragging
                    ? "border-[#FF5050] bg-black/80 shadow-[0_0_25px_rgba(255,80,80,0.3)]"
                    : "border-white/20 hover:border-[#FF5050] bg-black/60 hover:bg-black/80"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-black/50 border border-white/15 text-white">
                    <UploadCloud className="w-6 h-6 text-[#FF5050]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white">
                      <span className="text-[#FF5050] underline underline-offset-4 cursor-pointer">
                        CLICK TO UPLOAD
                      </span>{" "}
                      OR DRAG &amp; DROP PDFS
                    </p>
                    <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest mt-1">
                      MULTI-FILE ATTACHMENT • CONCURRENT EVALUATION
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded File List */}
              {resumes.length > 0 && (
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {resumes.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between p-3 bg-black/60 border border-white/10 hover:border-[#FF5050]/50 rounded-none transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden pr-2">
                        <span className="px-1.5 py-0.5 font-mono text-[10px] font-bold bg-[#FF5050]/20 text-[#FF5050] border border-[#FF5050]/40">
                          PDF
                        </span>
                        <p className="font-mono text-xs text-white truncate" title={file.name}>
                          {file.name}
                        </p>
                        <span className="font-mono text-[10px] text-gray-400">
                          ({formatFileSize(file.size)})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="p-1 text-gray-400 hover:text-[#FF5050] transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-gray-300 uppercase tracking-wider pt-2 border-t border-white/10">
              <span className="flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#FF5050]" />
                <span>{resumes.length} Dossiers Staged</span>
              </span>
              <span className="text-[#FF5050] font-bold">
                {resumes.length > 0 ? "ATTACHED" : "AWAITING PDFS"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Analyze & Rank Candidates (styled exactly like homepage buttons) */}
        <div>
          <button
            type="button"
            id="analyze-rank-btn"
            disabled={!isReadyToAnalyze}
            onClick={handleAnalyze}
            className={`w-full py-4 px-8 rounded-none font-mono uppercase font-bold tracking-widest text-xs sm:text-sm flex items-center justify-center space-x-3 transition-colors cursor-pointer ${
              isLoading
                ? "bg-[#FF5050]/80 text-white cursor-wait"
                : isReadyToAnalyze
                ? "bg-[#FF5050] hover:bg-[#e64040] text-white shadow-2xl"
                : "bg-[#3B403D] text-gray-400 border border-white/10 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
                <span>Extracting and Scoring...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white fill-white shrink-0" />
                <span>Analyze &amp; Rank Candidates</span>
              </>
            )}
          </button>
        </div>

        {/* Loading Indicator State */}
        {isLoading && (
          <div className="bg-[#3B403D] border border-white/10 p-12 text-center rounded-none shadow-2xl space-y-4">
            <div className="w-12 h-12 border-2 border-[#FF5050] border-t-transparent animate-spin mx-auto" />
            <h3 className="font-mono text-xl uppercase font-bold text-white tracking-widest">
              Extracting and Scoring...
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
              Extracting token text from {resumes.length} PDF dossiers and evaluating fit scores against your requirements.
            </p>
          </div>
        )}

        {/* Section 2: Results / Leaderboard (Below the inputs) */}
        {candidates.length > 0 && !isLoading && (
          <section id="results-leaderboard" className="space-y-6 pt-4">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
                  <h2 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                    Candidate Leaderboard
                  </h2>
                  <span className="px-2.5 py-0.5 font-mono text-xs uppercase font-bold bg-[#FF5050] text-white">
                    {candidates.length} Ranked
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  Ranked descending by Fit Score • Click candidate row to expand pros and cons
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={exportResultsJSON}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-black/60 hover:bg-black/90 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5050]" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FF5050] hover:bg-[#e64040] text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Screen</span>
                </button>
              </div>
            </div>

            {/* Candidate Cards Stack */}
            <div className="space-y-4">
              {candidates.map((candidate, idx) => {
                const isExpanded = expandedIndices.has(idx);
                const rank = idx + 1;
                const scoreValue = Math.round(candidate.fit_score);

                return (
                  <div
                    key={`${candidate.candidate_name}-${idx}`}
                    className="bg-[#3B403D] border border-white/10 hover:border-[#FF5050]/60 transition-all duration-300 rounded-none overflow-hidden shadow-2xl"
                  >
                    {/* Click-to-Expand Header */}
                    <div
                      onClick={() => toggleExpand(idx)}
                      className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none gap-5 group"
                    >
                      {/* Left: Rank & Candidate Name in crisp white text */}
                      <div className="flex items-start sm:items-center space-x-4">
                        <div
                          className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                            rank === 1
                              ? "bg-[#FF5050] text-white"
                              : rank === 2
                              ? "bg-white/20 text-white"
                              : "bg-black border border-white/15 text-gray-300"
                          }`}
                        >
                          #{rank}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Candidate Name in crisp white text */}
                            <h3 className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-[#FF5050] transition-colors">
                              {candidate.candidate_name}
                            </h3>

                            {rank === 1 && (
                              <span className="px-2 py-0.5 bg-[#FF5050]/20 text-[#FF5050] border border-[#FF5050]/40 font-mono text-[10px] uppercase font-bold tracking-wider">
                                TOP FIT
                              </span>
                            )}
                          </div>

                          <p className="font-sans text-xs sm:text-sm text-gray-200 mt-1 line-clamp-1 max-w-2xl">
                            {candidate.verdict}
                          </p>
                        </div>
                      </div>

                      {/* Right: Massive, bold coral/red Fit Score */}
                      <div className="flex items-center justify-between sm:justify-end space-x-6 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                        <div className="text-right">
                          <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-[#FF5050] tracking-tighter leading-none">
                            {scoreValue}
                            <span className="text-2xl sm:text-3xl text-[#FF5050]/80 ml-0.5">%</span>
                          </div>
                          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                            FIT SCORE
                          </p>
                        </div>

                        <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                              isExpanded ? "rotate-180 text-[#FF5050]" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded details smoothly revealing pros and cons */}
                    {isExpanded && (
                      <div className="p-6 sm:p-7 pt-0 border-t border-white/10 bg-black/40 space-y-6 transition-all duration-300">
                        {/* Executive Verdict summary */}
                        <div className="p-4 bg-black/80 border border-white/10 mt-6">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2.5 h-2.5 bg-[#FF5050] rotate-45 shrink-0" />
                            <span className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                              HR Screener Verdict
                            </span>
                          </div>
                          <p className="font-sans text-sm text-gray-200 leading-relaxed">
                            {candidate.verdict}
                          </p>
                        </div>

                        {/* Pros (Key Strengths) & Cons (Missing Requirements) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Pros: Key Strengths */}
                          <div className="p-5 bg-black/70 border border-white/10 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-white/10">
                                <Sparkles className="w-4 h-4 text-[#FF5050]" />
                                <h4 className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                                  Key Strengths ({candidate.key_strengths.length})
                                </h4>
                              </div>

                              {candidate.key_strengths.length > 0 ? (
                                <ul className="space-y-2 font-sans text-xs sm:text-sm text-gray-200 list-disc list-inside marker:text-[#FF5050]">
                                  {candidate.key_strengths.map((str, sIdx) => (
                                    <li key={sIdx} className="leading-relaxed">
                                      <span>{str}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="font-mono text-xs text-gray-500 italic">
                                  [ No distinct strengths identified ]
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Cons: Missing Requirements */}
                          <div className="p-5 bg-black/70 border border-white/10 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-white/10">
                                <AlertCircle className="w-4 h-4 text-[#FF5050]" />
                                <h4 className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                                  Missing Requirements ({candidate.missing_requirements.length})
                                </h4>
                              </div>

                              {candidate.missing_requirements.length > 0 ? (
                                <ul className="space-y-2 font-sans text-xs sm:text-sm text-gray-200 list-disc list-inside marker:text-[#FF5050]">
                                  {candidate.missing_requirements.map((miss, mIdx) => (
                                    <li key={mIdx} className="leading-relaxed">
                                      <span>{miss}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="font-mono text-xs text-gray-300 flex items-center space-x-2 py-1">
                                  <CheckCircle2 className="w-4 h-4 text-[#FF5050]" />
                                  <span>No critical gaps detected</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
