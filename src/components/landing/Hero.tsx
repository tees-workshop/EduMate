"use client";

import Link from "next/link";
import { ArrowRight, Brain, Play, Star, Users, TrendingUp } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl animate-orb" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl animate-orb delay-300" />
                <div className="absolute bottom-20 right-1/3 w-72 h-72 rounded-full bg-purple-400/15 blur-3xl animate-orb delay-500" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left content */}
                    <div className="animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-indigo-700 text-xs font-semibold tracking-wide uppercase">
                                AI-Powered Academic Assistant
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                            Study Smarter,{" "}
                            <span className="gradient-text">Ace Every</span>{" "}
                            Assessment
                        </h1>

                        <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
                            EduMate combines intelligent readiness prediction, personalized study plans,
                            and powerful productivity tools — so you always know exactly where to focus.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link
                                href="/register"
                                className="gradient-bg text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                Start for Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            {/* <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-base hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                                </div>
                                Watch Demo
                            </button> */}
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {["A", "B", "C", "D"].map((l, i) => (
                                    <div
                                        key={i}
                                        className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md"
                                        style={{
                                            background: ["#4F46E5", "#06B6D4", "#8B5CF6", "#22C55E"][i],
                                        }}
                                    >
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">12,000+</span> students trust StudyAI
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right – floating dashboard card */}
                    <div className="relative animate-fade-in-up delay-300">
                        <div className="relative animate-float">
                            {/* Main card */}
                            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 p-6 border border-slate-100">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                        <Brain className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">Readiness Score</p>
                                        <p className="text-xs text-slate-400">Data Structures Final</p>
                                    </div>
                                    <div className="ml-auto bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                                        Ready ✓
                                    </div>
                                </div>

                                {/* Circular progress */}
                                <div className="flex items-center gap-5 mb-5">
                                    <div className="relative w-24 h-24">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#EEF2FF" strokeWidth="10" />
                                            <circle
                                                cx="50" cy="50" r="40" fill="none"
                                                stroke="url(#gradient)" strokeWidth="10"
                                                strokeLinecap="round"
                                                strokeDasharray="251.3"
                                                strokeDashoffset="50"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#4F46E5" />
                                                    <stop offset="100%" stopColor="#06B6D4" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-slate-800">80%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        {[
                                            { label: "Graphs", pct: 92, color: "bg-indigo-500" },
                                            { label: "Trees", pct: 78, color: "bg-cyan-500" },
                                            { label: "Sorting", pct: 65, color: "bg-amber-500" },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-600">{item.label}</span>
                                                    <span className="font-semibold text-slate-700">{item.pct}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-50 rounded-2xl p-3 text-xs text-indigo-700 flex items-start gap-2">
                                    <span className="text-base">🤖</span>
                                    <p><strong>AI Tip:</strong> Focus 20 more minutes on Sorting algorithms to reach 85% readiness.</p>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-bold text-slate-700">+12% this week</span>
                            </div>

                            {/* Floating users badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span className="text-sm font-bold text-slate-700">12k+ Students</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
