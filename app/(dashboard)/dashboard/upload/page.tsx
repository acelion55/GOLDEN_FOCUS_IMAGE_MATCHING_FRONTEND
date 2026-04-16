"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: "uploading",
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => {
            if (f.id === file.id) {
              if (f.progress >= 100) {
                clearInterval(interval);
                return { ...f, status: "processing", progress: 100 };
              }
              return { ...f, progress: f.progress + Math.random() * 20 };
            }
            return f;
          })
        );
      }, 200);

      // Simulate processing completion
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === file.id ? { ...f, status: "completed" } : f)
        );
      }, 3000 + index * 500);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1a1a1a] border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#a3925d]">Upload Photos</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-white/10 transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#a3925d] mb-8 hidden lg:block">Dashboard</h2>
            
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              <Link href="/dashboard/upload" className="flex items-center gap-3 px-4 py-3 text-white bg-[#a3925d]/20 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photos
              </Link>
              
              <Link href="/dashboard/events" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                Events
              </Link>
              
              <Link href="/dashboard/photos" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v16a2 2 0 002 2z" />
                </svg>
                Photos
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 hidden lg:block">
              <h1 className="text-3xl font-bold text-white mb-2">Upload Photos</h1>
              <p className="text-white/60">Upload your event photos for AI processing and face recognition</p>
            </div>

            {/* Event Details */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Sarah & Mike Wedding"
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-[#a3925d] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-white focus:border-[#a3925d] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Upload Photos
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-[#a3925d] bg-[#a3925d]/10' 
                    : 'border-white/20 hover:border-white/40'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Drop your photos here
                </h3>
                <p className="text-white/60 mb-6">
                  or click to browse your files
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-[#a3925d] text-white rounded-lg hover:bg-[#b8a76b] transition-colors font-medium"
                >
                  Choose Files
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                
                <p className="text-white/40 text-sm mt-4">
                  Supports: JPEG, PNG, TIFF, RAW files • Max 50MB per file
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadedFiles.length > 0 && (
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⏳</span>
                  Upload Progress ({uploadedFiles.length} files)
                </h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="bg-[#0a0a0a] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{file.name}</p>
                          <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <StatusBadge status={file.status} />
                          {file.status !== "completed" && (
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-white/40 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {file.status === "uploading" && (
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-[#a3925d] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(file.progress, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      disabled={!eventName || uploadedFiles.some(f => f.status === "uploading")}
                      className="flex-1 px-6 py-3 bg-[#a3925d] text-white rounded-lg hover:bg-[#b8a76b] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Process Photos with AI
                    </button>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="px-6 py-3 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    uploading: "bg-blue-400/20 text-blue-400 border-blue-400/30",
    processing: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
    completed: "bg-green-400/20 text-green-400 border-green-400/30",
    error: "bg-red-400/20 text-red-400 border-red-400/30",
  };
  
  const icons = {
    uploading: "⬆️",
    processing: "⚙️",
    completed: "✅",
    error: "❌",
  };
  
  return (
    <span className={`px-3 py-1 text-xs rounded-full border font-medium flex items-center gap-1 ${styles[status as keyof typeof styles] || styles.uploading}`}>
      <span>{icons[status as keyof typeof icons]}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}