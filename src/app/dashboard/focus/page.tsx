"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle, SkipForward } from "lucide-react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; duration: number; color: string; icon: typeof Brain }> = {
    focus: { label: "Focus Session", duration: 25 * 60, color: "#22d3ee", icon: Brain },
    short: { label: "Short Break", duration: 5 * 60, color: "#059669", icon: Coffee },
    long:  { label: "Long Break",  duration: 15 * 60, color: "#818cf8", icon: Coffee },
};

const TIPS = [
    "Put your phone face-down and silence notifications.",
    "Keep a glass of water on your desk.",
    "Write down what you want to achieve this session before starting.",
    "If a thought distracts you, write it down and return to it later.",
    "Your brain works best in focused sprints — trust the process.",
    "One topic at a time. Multitasking reduces quality.",
    "After this session, take your break seriously — it is part of the process.",
];

export default function FocusPage() {
    const [mode, setMode] = useState<Mode>("focus");
    const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
    const [running, setRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const current = MODES[mode];
    const total = current.duration;
    const progress = ((total - timeLeft) / total) * 100;

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setRunning(false);
                        if (mode === "focus") setSessionsCompleted(s => s + 1);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, mode]);

    const switchMode = (m: Mode) => {
        setMode(m);
        setTimeLeft(MODES[m].duration);
        setRunning(false);
    };

    const reset = () => {
        setTimeLeft(current.duration);
        setRunning(false);
    };

    const skip = () => {
        setTimeLeft(0);
        setRunning(false);
        if (mode === "focus") setSessionsCompleted(s => s + 1);
    };

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex min-h-screen relative" style={{ background: "#080d14" }}>

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: current.color, filter: "blur(140px)", opacity: 0.07,
                        top: "-100px", left: "-100px",
                        animation: "driftA1 8s ease-in-out infinite"
                    }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "#818cf8", filter: "blur(130px)", opacity: 0.05,
                        bottom: "-80px", right: "-80px",
                        animation: "driftA2 10s ease-in-out infinite"
                    }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Focus Session" />

                    <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-auto">
                        <div className="max-w-4xl mx-auto">

                            {/* Mode Selector */}
                            <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit border mx-auto"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)"
                                }}>
                                {(Object.keys(MODES) as Mode[]).map(m => (
                                    <button
                                        key={m}
                                        onClick={() => switchMode(m)}
                                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                                        style={mode === m ? {
                                            background: `linear-gradient(135deg, ${MODES[m].color}, ${m === "focus" ? "#059669" : m === "short" ? "#22d3ee" : "#22d3ee"})`,
                                            color: "#080d14",
                                            boxShadow: `0 4px 16px ${MODES[m].color}33`
                                        } : { color: "#64748b" }}
                                    >
                                        {MODES[m].label}
                                    </button>
                                ))}
                            </div>

                            {/* Timer Card */}
                            <div className="rounded-3xl border p-8 md:p-12 mb-6 flex flex-col items-center"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)",
                                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)"
                                }}>

                                {/* Circular Progress */}
                                <div className="relative w-64 h-64 mb-8">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 264 264">
                                        {/* Background circle */}
                                        <circle
                                            cx="132" cy="132" r="120"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.06)"
                                            strokeWidth="8"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            cx="132" cy="132" r="120"
                                            fill="none"
                                            stroke={current.color}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 8px ${current.color})` }}
                                        />
                                    </svg>

                                    {/* Timer Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-6xl font-black text-white tracking-tight">
                                            {mins}:{secs}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-widest mt-2"
                                            style={{ color: current.color }}>
                                            {current.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={reset}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all hover:scale-110"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            borderColor: "rgba(255,255,255,0.08)",
                                            color: "#64748b"
                                        }}>
                                        <RotateCcw className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => setRunning(!running)}
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                                        style={{
                                            background: `linear-gradient(135deg, ${current.color}, #059669)`,
                                            color: "#080d14",
                                            boxShadow: `0 8px 24px ${current.color}44`
                                        }}>
                                        {running
                                            ? <Pause className="w-8 h-8" />
                                            : <Play className="w-8 h-8 ml-1" />}
                                    </button>

                                    <button
                                        onClick={skip}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all hover:scale-110"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            borderColor: "rgba(255,255,255,0.08)",
                                            color: "#64748b"
                                        }}>
                                        <SkipForward className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Sessions completed */}
                                <div className="flex items-center gap-2 mt-8">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i}
                                            className="w-3 h-3 rounded-full transition-all"
                                            style={{
                                                background: i < sessionsCompleted % 4
                                                    ? current.color
                                                    : "rgba(255,255,255,0.08)",
                                                boxShadow: i < sessionsCompleted % 4
                                                    ? `0 0 8px ${current.color}`
                                                    : "none"
                                            }} />
                                    ))}
                                    <span className="text-xs ml-2 font-bold"
                                        style={{ color: "#475569" }}>
                                        {sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""} completed
                                    </span>
                                </div>
                            </div>

                            {/* Bottom grid */}
                            <div className="grid md:grid-cols-2 gap-5">

                                {/* Study tip */}
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                                        style={{ color: "#475569" }}>
                                        Focus Tip
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                                        💡 {tip}
                                    </p>
                                </div>

                                {/* How it works */}
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                                        style={{ color: "#475569" }}>
                                        How It Works
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { icon: Brain, text: "Study for 25 minutes" },
                                            { icon: Coffee, text: "Take a 5 minute break" },
                                            { icon: CheckCircle, text: "After 4 sessions, take a 15 minute break" },
                                        ].map(({ icon: Icon, text }, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{
                                                        background: "rgba(34,211,238,0.08)",
                                                        border: "1px solid rgba(34,211,238,0.15)"
                                                    }}>
                                                    <Icon className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                                                </div>
                                                <span className="text-xs" style={{ color: "#64748b" }}>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}