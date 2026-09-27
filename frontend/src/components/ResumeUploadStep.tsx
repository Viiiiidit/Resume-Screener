"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  FileCheck,
  CheckCircle,
} from "lucide-react";

interface ResumeUploadStepProps {
  files: File[];
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
}

export default function ResumeUploadStep({
  files,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
}: ResumeUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const validateAndAddFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const validPdfs: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(incomingFiles).forEach((file) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        // Prevent duplicate file names if already added
        const isDuplicate = files.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );
        if (!isDuplicate) {
          validPdfs.push(file);
        }
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(
        `Only PDF documents are supported. Rejected: ${invalidFiles.join(", ")}`
      );
    }

    if (validPdfs.length > 0) {
      onAddFiles(validPdfs);
    }
  };

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
    // Reset file input so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40 backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold text-xs">
            2
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5 cursor-pointer">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
              <span>2. Upload Applicant Resumes (PDFs)</span>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            id="clear-all-resumes-btn"
            onClick={onClearFiles}
            className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove All ({files.length})</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="resume-file-input"
        type="file"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drag & Drop Zone */}
      <div
        id="resume-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-500/10 scale-[1.01] shadow-lg shadow-blue-500/10"
            : "border-slate-800 hover:border-slate-600 bg-slate-950/50 hover:bg-slate-950/80"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isDragging
                ? "bg-blue-500/20 text-blue-400 animate-bounce"
                : "bg-slate-800/80 text-slate-400 group-hover:text-slate-200"
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              <span className="text-blue-400 hover:underline">Click to browse</span> or drag & drop PDF resumes here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports multiple files • Standard PDF format (max 15MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mt-3 flex items-start space-x-2 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-300 p-2.5 rounded-lg animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-medium flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Queued for Screening ({files.length}):</span>
            </span>
          </div>

          <div
            id="uploaded-files-list"
            className="max-h-48 overflow-y-auto space-y-1.5 pr-1"
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                id={`resume-item-${index}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 text-xs transition-colors group"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                  <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-rose-400">PDF</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-slate-200 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-2.5 h-2.5 mr-1" />
                    Ready
                  </span>
                  <button
                    type="button"
                    id={`remove-resume-btn-${index}`}
                    onClick={() => onRemoveFile(index)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Remove ${file.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
