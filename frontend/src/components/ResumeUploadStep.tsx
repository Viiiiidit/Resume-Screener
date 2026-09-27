"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  Trash2,
  AlertCircle,
  FileCheck,
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
        `UNSUPPORTED FORMAT DETECTED. REJECTED: ${invalidFiles.join(", ")}`
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
  };

  const handleDropFiles = (e: React.DragEvent<HTMLDivElement>) => {
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

  return (
    <div className="bg-[#3B403D] border border-white/10 p-6 sm:p-7 shadow-2xl relative rounded-none transition-all">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[#FF5050] rotate-45 shrink-0" />
          <h2 className="font-mono text-sm uppercase font-bold text-white tracking-widest">
            2. Upload Applicant Resumes (PDFs)
          </h2>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            id="clear-all-resumes-btn"
            onClick={onClearFiles}
            className="flex items-center space-x-1.5 font-mono text-xs uppercase tracking-wider text-gray-300 hover:text-[#FF5050] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear ({files.length})</span>
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
        onDrop={handleDropFiles}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 rounded-none select-none ${
          isDragging
            ? "border-[#FF5050] bg-black/80 shadow-[0_0_25px_rgba(255,80,80,0.3)]"
            : "border-white/20 hover:border-[#FF5050] bg-black/60 hover:bg-black/80"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-none transition-all ${
              isDragging
                ? "bg-[#FF5050] text-white"
                : "bg-black/50 border border-white/15 text-white"
            }`}
          >
            <UploadCloud className="w-6 h-6 text-[#FF5050]" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-white">
              <span className="text-[#FF5050] underline underline-offset-4 cursor-pointer">
                BROWSE FILES
              </span>{" "}
              OR DRAG &amp; DROP PDFS
            </p>
            <p className="font-mono text-[11px] text-gray-400 uppercase tracking-widest mt-1">
              SUPPORTED: MULTIPART PDF • CONCURRENT PARSING
            </p>
          </div>
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mt-3 flex items-start space-x-2 text-xs bg-black/80 border border-[#FF5050] text-[#FF5050] p-3 rounded-none font-mono">
          <AlertCircle className="w-4 h-4 text-[#FF5050] shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-gray-300 px-1">
            <span className="flex items-center space-x-1.5 text-white">
              <FileCheck className="w-3.5 h-3.5 text-[#FF5050]" />
              <span>STAGED FILES ({files.length}):</span>
            </span>
          </div>

          <div
            id="uploaded-files-list"
            className="max-h-52 overflow-y-auto space-y-2 pr-1"
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                id={`resume-item-${index}`}
                className="flex items-center justify-between p-3 bg-black/60 border border-white/10 hover:border-[#FF5050]/50 rounded-none transition-colors group"
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className="w-7 h-7 bg-[#FF5050]/15 border border-[#FF5050]/40 flex items-center justify-center shrink-0">
                    <span className="font-mono text-[9px] font-bold text-[#FF5050]">PDF</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-xs text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="font-mono text-[10px] text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 font-mono text-[10px]">
                  <span className="text-white border border-white/20 px-2 py-0.5 bg-black/40">
                    STAGED
                  </span>
                  <button
                    type="button"
                    id={`remove-resume-btn-${index}`}
                    onClick={() => onRemoveFile(index)}
                    className="p-1 text-gray-400 hover:text-[#FF5050] transition-colors cursor-pointer"
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
