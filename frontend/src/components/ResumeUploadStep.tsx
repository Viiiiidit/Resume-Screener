"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  FileCheck,
  Check,
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
    <div className="bg-[#131d16] border border-[#233828] p-6 sm:p-7 shadow-lg relative rounded-none transition-all">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#233828]">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-[#FF3333] rounded-none" />
          <span className="font-mono text-xs uppercase font-bold text-white tracking-widest">
            // 02. INGEST CANDIDATE DOSSIERS (PDF)
          </span>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            id="clear-all-resumes-btn"
            onClick={onClearFiles}
            className="flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#FF3333] transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Flush ({files.length})</span>
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

      {/* Drag & Drop Zone with fluid hover transition */}
      <div
        id="resume-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 rounded-none select-none ${
          isDragging
            ? "border-[#FF3333] bg-[#221010] shadow-[0_0_25px_rgba(255,51,51,0.2)]"
            : "border-[#233828] hover:border-[#FF3333]/80 bg-[#0b120d] hover:bg-[#0f1712]"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-none transition-all ${
              isDragging
                ? "bg-[#FF3333] text-white"
                : "bg-[#19291e] border border-[#2a4532] text-emerald-300"
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-white">
              <span className="text-[#FF3333] underline underline-offset-4 cursor-pointer">
                BROWSE FILESYSTEM
              </span>{" "}
              OR DRAG &amp; DROP PDF STREAM
            </p>
            <p className="font-mono text-[11px] text-neutral-500 uppercase tracking-widest mt-1">
              MULTIPART PDF INGESTION • MAX 15MB PER NODE
            </p>
          </div>
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mt-3 flex items-start space-x-2 text-xs bg-[#241010] border border-[#FF3333]/40 text-[#FF6B6B] p-3 rounded-none font-mono">
          <AlertCircle className="w-4 h-4 text-[#FF3333] shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <FileCheck className="w-3.5 h-3.5" />
              <span>STAGED INGESTION NODES ({files.length}):</span>
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
                className="flex items-center justify-between p-3 bg-[#0b120d] border border-[#233828] hover:border-[#FF3333]/50 rounded-none transition-colors group"
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className="w-7 h-7 bg-[#FF3333]/10 border border-[#FF3333]/40 flex items-center justify-center shrink-0">
                    <span className="font-mono text-[9px] font-bold text-[#FF3333]">PDF</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono text-xs text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="font-mono text-[10px] text-neutral-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 font-mono text-[10px]">
                  <span className="text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-950/30">
                    STAGED
                  </span>
                  <button
                    type="button"
                    id={`remove-resume-btn-${index}`}
                    onClick={() => onRemoveFile(index)}
                    className="p-1 text-neutral-500 hover:text-[#FF3333] transition-colors cursor-pointer"
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
