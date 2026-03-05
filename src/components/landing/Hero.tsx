"use client";

import Link from "next/link";
import { ArrowRight, Star, Zap } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20"
            style={{ background: "#080d14" }}>

            {/* Aurora blobs — Option D (drift + pulse + orbit combined) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Blob 1 — cyan, top left, drifts + pulses */}
                <div className="absolute w-[220px] h-[220px] rounded-full"
                    style={{
                        background: "#22d3ee",
                        filter: "blur(70px)",
                        opacity: 0.2,
                        top: "-40px",
                        left: "-40px",
                        animation: "driftA1 8s ease-in-out infinite, pulseBlob1 4s ease-in-out infinite"
                    }} />

                {/* Blob 2 — emerald, bottom right, drifts + pulses */}
                <div className="absolute w-[200px] h-[200px] rounded-full"
                    style={{
                        background: "#059669",
                        filter: "blur(60px)",
                        opacity: 0.2,
                        bottom: "-40px",
                        right: "-40px",
                        animation: "driftA2 10s ease-in-out infinite, pulseBlob2 5s ease-in-out infinite"
                    }} />

                {/* Blob 3 — violet, center, drifts + pulses */}
                <div className="absolute w-[150px] h-[150px] rounded-full"
                    style={{
                        background: "#818cf8",
                        filter: "blur(50px)",
                        opacity: 0.15,
                        top: "30%",
                        left: "30%",
                        animation: "driftA3 12s ease-in-out infinite, pulseBlob3 6s ease-in-out infinite"
                    }} />

                {/* Orbiting ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[500px] h-[500px] animate-orbit-spin">
                        <div className="absolute rounded-full"
                            style={{
                                top: "-30px", left: "50%", transform: "translateX(-50%)",
                                width: "60px", height: "60px",
                                background: "#22d3ee",
                                filter: "blur(20px)",
                                opacity: 0.3
                            }} />
                        <div className="absolute rounded-full"
                            style={{
                                bottom: "-30px", left: "50%", transform: "translateX(-50%)",
                                width: "50px", height: "50px",
                                background: "#818cf8",
                                filter: "blur(18px)",
                                opacity: 0.3
                            }} />
                    </div>
                </div>

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left content */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
                            style={{
                                background: "rgba(34,211,238,0.08)",
                                borderColor: "rgba(34,211,238,0.2)"
                            }}>
                            <span className="w-2 h-2 rounded-full animate-pulse"
                                style={{ background: "#22d3ee" }} />
                            <span className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: "#22d3ee" }}>
                                AI-Powered Readiness Engine
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] tracking-tight mb-6">
                            Study Smarter,{" "}
                            <span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                Ace Every
                            </span>{" "}
                            Assessment
                        </h1>

                        <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "#94a3b8" }}>
                            EduMate uses machine learning to predict your exam readiness from your
                            study habits and quiz performance — so you never walk in underprepared again.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link
                                href="/register"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#080d14",
                                    boxShadow: "0 8px 32px rgba(34,211,238,0.25)"
                                }}
                            >
                                Start for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all border"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    color: "#f1f5f9"
                                }}
                            >
                                View Demo
                            </Link>
                        </div>

                        {/* Honest tagline */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm font-semibold" style={{ color: "#94a3b8" }}>
                                Built for students, by a student
                            </p>
                        </div>
                    </div>

                    {/* Right – Option D: Dashboard split */}
                    <div className="relative">
                        <div className="rounded-2xl p-6 border backdrop-blur-xl"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                borderColor: "rgba(34,211,238,0.15)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
                            }}>

                            {/* Card header */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="text-sm font-bold text-white">Data Structures Final</div>
                                <div className="px-3 py-1 rounded-lg text-xs font-bold"
                                    style={{ background: "rgba(5,150,105,0.15)", color: "#34d399" }}>
                                    Ready ✓
                                </div>
                            </div>

                            {/* Score left + topics right */}
                            <div className="flex gap-4 mb-5">

                                {/* Left score column */}
                                <div className="flex flex-col items-center justify-center rounded-xl px-5 py-4 border shrink-0"
                                    style={{
                                        background: "rgba(34,211,238,0.05)",
                                        borderColor: "rgba(34,211,238,0.12)"
                                    }}>
                                    <div className="text-5xl font-black leading-none mb-1"
                                        style={{
                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent"
                                        }}>
                                        80%
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest"
                                        style={{ color: "#64748b" }}>
                                        Readiness
                                    </div>
                                </div>

                                {/* Right topics column */}
                                <div className="flex-1 flex flex-col gap-2.5">
                                    {[
                                        { label: "Quiz Score", value: "9/10", pct: 90, color: "#22d3ee" },
                                        { label: "Avg Time", value: "28s", pct: 75, color: "#059669" },
                                        { label: "Confidence", value: "High", pct: 85, color: "#818cf8" },
                                    ].map((item) => (
                                        <div key={item.label}
                                            className="rounded-xl px-3 py-2.5 border"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                borderColor: "rgba(255,255,255,0.06)"
                                            }}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-bold text-white">{item.label}</span>
                                                <span className="text-xs font-black"
                                                    style={{ color: item.color }}>{item.value}</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden"
                                                style={{ background: "rgba(255,255,255,0.06)" }}>
                                                <div className="h-full rounded-full transition-all"
                                                    style={{ width: `${item.pct}%`, background: item.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Tip */}
                            <div className="rounded-xl p-3 text-xs flex items-start gap-2"
                                style={{
                                    background: "rgba(129,140,248,0.08)",
                                    borderLeft: "2px solid #818cf8"
                                }}>
                                <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#818cf8" }} />
                                <p style={{ color: "#c7d2fe" }}>
                                    <strong>AI Tip:</strong> Your quiz performance confirms your baseline prediction. You are ready — go ace that exam!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}