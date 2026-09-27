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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all hover:border-gray-300">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200">
            2
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-900 flex items-center space-x-2 cursor-pointer">
              <UploadCloud className="w-4 h-4 text-gray-600" />
              <span>2. Upload Applicant Resumes (PDFs)</span>
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Select or drop PDF resumes to screen against requirements
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <button
            type="button"
            id="clear-all-resumes-btn"
            onClick={onClearFiles}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Drag & Drop Zone with fluid hover transition */}
      <div
        id="resume-dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragging
            ? "border-blue-500 bg-blue-50/70 scale-[1.01] shadow-xs"
            : "border-gray-200 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              isDragging
                ? "bg-blue-100 text-blue-600 scale-110"
                : "bg-white border border-gray-200 text-gray-500 shadow-2xs"
            }`}
          >
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              <span className="text-blue-600 hover:underline">Click to browse</span> or drag and drop PDF resumes here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports multiple files • Standard PDF format (max 15MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error message banner */}
      {errorMessage && (
        <div className="mt-3 flex items-start space-x-2 text-xs bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span className="font-medium flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Queued for Screening ({files.length}):</span>
            </span>
          </div>

          <div
            id="uploaded-files-list"
            className="max-h-52 overflow-y-auto space-y-1.5 pr-1"
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                id={`resume-item-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/70 border border-gray-200 text-xs transition-colors group"
              >
                <div className="flex items-center space-x-3 overflow-hidden pr-2">
                  <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200/60 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-red-600">PDF</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                    Ready
                  </span>
                  <button
                    type="button"
                    id={`remove-resume-btn-${index}`}
                    onClick={() => onRemoveFile(index)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
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
