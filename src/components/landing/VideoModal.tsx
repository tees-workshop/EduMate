"use client";

import { X, Play } from "lucide-react";
import { useEffect } from "react";

export default function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    // Escape key handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
             style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
                 
            {/* Click outside to close map */}
            <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
            
            <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border animate-fade-in-up"
                 style={{ 
                     background: "#080d14",
                     borderColor: "rgba(34,211,238,0.3)", 
                     boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                     animation: "fadeUp 0.4s ease-out forwards"
                 }}>
                
                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-black/60 hover:bg-black/90 rounded-full text-white backdrop-blur-md transition-all hover:scale-110"
                        title="Close video (Esc)"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Video container with 16:9 aspect ratio */}
                <div className="relative w-full pt-[56.25%]">
                    
                    {/* Placeholder for real video. 
                        To use real video, uncomment the <video> tag below and remove this placeholder block.
                    */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-6" 
                         style={{ background: "linear-gradient(135deg, #0f172a, #080d14)" }}>
                             
                        <div className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md border animate-pulse" 
                             style={{ 
                                 background: "rgba(34,211,238,0.1)",
                                 borderColor: "rgba(34,211,238,0.3)"
                             }}>
                           <Play className="w-8 h-8 ml-1" style={{ color: "#22d3ee" }} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">EduMate Dashboard Demo</h3>
                            <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>
                                Waiting for video asset. <br/> Replace placeholder in src/components/landing/VideoModal.tsx
                            </p>
                        </div>
                    </div>

                    {/* 
                      <video 
                          src="/demo.mp4" 
                          controls 
                          autoPlay 
                          className="absolute inset-0 w-full h-full object-cover" 
                      /> 
                    */}
                </div>
            </div>
            
            <style jsx>{`
               @keyframes fadeUp {
                  from { opacity: 0; transform: translateY(40px) scale(0.95); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
               }
               .animate-fade-in-up {
                  animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
               }
            `}</style>
        </div>
    );
}
