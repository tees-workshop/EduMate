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
                    
                    <img
                        src="/demo.webp"
                        alt="EduMate Dashboard Demo"
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                    />
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
