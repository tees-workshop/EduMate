"use client";

import Link from "next/link";

function EduMateLogo() {
    return (
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(15 18 18)" fill="#059669" opacity="0.15" />
            <path d="M18 10L24 18L18 26L12 18Z" fill="#059669" opacity="0.9" />
            <circle cx="18" cy="18" r="3" fill="#22d3ee" />
            <circle cx="18" cy="5" r="1.5" fill="#22d3ee" opacity="0.8" />
            <circle cx="30" cy="12" r="1.5" fill="#059669" opacity="0.8" />
            <circle cx="30" cy="24" r="1.5" fill="#818cf8" opacity="0.8" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="relative border-t theme-card theme-border theme-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

                    {/* Logo + note */}
                    <div className="flex items-center gap-3">
                        <EduMateLogo />
                        <div>
                            <span className="text-base font-black theme-text">
                                Edu<span style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>Mate</span>
                            </span>
                            <p className="text-xs theme-text-muted">
                                Built for students, by a student.
                            </p>
                        </div>
                    </div>


                    {/* Copyright */}
                    <p className="text-xs theme-text-muted">
                        © 2026 EduMate. <br/> All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}