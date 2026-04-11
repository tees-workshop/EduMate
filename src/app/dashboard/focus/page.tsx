"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle, SkipForward, Settings, X } from "lucide-react";

type Mode = "focus" | "short" | "long";

const DEFAULT_DURATIONS: Record<Mode, number> = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
};

const MODE_COLORS: Record<Mode, string> = {
    focus: "#22d3ee",
    short: "#059669",
    long: "#818cf8",
};

const MODE_LABELS: Record<Mode, string> = {
    focus: "Focus Session",
    short: "Short Break",
    long: "Long Break",
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
    const [durations, setDurations] = useState(DEFAULT_DURATIONS);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.focus);
    const [running, setRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
    const [showSettings, setShowSettings] = useState(false);
    const [tempDurations, setTempDurations] = useState({ focus: 25, short: 5, long: 15 });
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const color = MODE_COLORS[mode];
    const total = durations[mode];
    const progress = ((total - timeLeft) / total) * 100;
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

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
        setTimeLeft(durations[m]);
        setRunning(false);
    };

    const reset = () => {
        setTimeLeft(durations[mode]);
        setRunning(false);
    };

    const skip = () => {
        setTimeLeft(0);
        setRunning(false);
        if (mode === "focus") setSessionsCompleted(s => s + 1);
    };

    const saveSettings = () => {
        const newDurations = {
            focus: Math.max(1, Math.min(60, tempDurations.focus)) * 60,
            short: Math.max(1, Math.min(30, tempDurations.short)) * 60,
            long: Math.max(1, Math.min(60, tempDurations.long)) * 60,
        };
        setDurations(newDurations);
        setTimeLeft(newDurations[mode]);
        setRunning(false);
        setShowSettings(false);
    };

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");

    return (
        <div className="flex min-h-screen relative" style={{ background: "#080d14" }}>
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{ background: color, filter: "blur(140px)", opacity: 0.07, top: "-100px", left: "-100px", animation: "driftA1 8s ease-in-out infinite" }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{ background: "#818cf8", filter: "blur(130px)", opacity: 0.05, bottom: "-80px", right: "-80px", animation: "driftA2 10s ease-in-out infinite" }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-auto">
                        <div className="max-w-2xl mx-auto">

                            {/* Mode Selector */}
                            <div className="flex gap-1.5 mb-6 p-1 rounded-2xl w-full border"
                                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                                {(Object.keys(MODE_LABELS) as Mode[]).map(m => (
                                    <button key={m} onClick={() => switchMode(m)}
                                        className="flex-1 px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all"
                                        style={mode === m ? {
                                            background: `linear-gradient(135deg, ${MODE_COLORS[m]}, #059669)`,
                                            color: "#080d14",
                                            boxShadow: `0 4px 16px ${MODE_COLORS[m]}33`
                                        } : { color: "#64748b" }}>
                                        {MODE_LABELS[m]}
                                    </button>
                                ))}
                            </div>

                            {/* Timer Card */}
                            <div className="rounded-3xl border p-6 md:p-10 mb-5 flex flex-col items-center"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)",
                                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)"
                                }}>

                                {/* Settings button */}
                                <div className="w-full flex justify-end mb-4">
                                    <button onClick={() => {
                                        setTempDurations({
                                            focus: durations.focus / 60,
                                            short: durations.short / 60,
                                            long: durations.long / 60
                                        });
                                        setShowSettings(true);
                                    }}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            borderColor: "rgba(255,255,255,0.08)",
                                            color: "#64748b"
                                        }}>
                                        <Settings className="w-3.5 h-3.5" /> Adjust Timer
                                    </button>
                                </div>

                                {/* Circular Progress */}
                                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 264 264">
                                        <circle cx="132" cy="132" r="120" fill="none"
                                            stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                        <circle cx="132" cy="132" r="120" fill="none"
                                            stroke={color} strokeWidth="8" strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 8px ${color})` }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                            {mins}:{secs}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-widest mt-2"
                                            style={{ color }}>
                                            {MODE_LABELS[mode]}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4">
                                    <button onClick={reset}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all hover:scale-110"
                                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}>
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => setRunning(!running)}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                                        style={{
                                            background: `linear-gradient(135deg, ${color}, #059669)`,
                                            color: "#080d14",
                                            boxShadow: `0 8px 24px ${color}44`
                                        }}>
                                        {running ? <Pause className="w-7 h-7 md:w-8 md:h-8" /> : <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" />}
                                    </button>
                                    <button onClick={skip}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all hover:scale-110"
                                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}>
                                        <SkipForward className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Sessions dots */}
                                <div className="flex items-center gap-2 mt-6">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full transition-all"
                                            style={{
                                                background: i < sessionsCompleted % 4 ? color : "rgba(255,255,255,0.08)",
                                                boxShadow: i < sessionsCompleted % 4 ? `0 0 8px ${color}` : "none"
                                            }} />
                                    ))}
                                    <span className="text-xs ml-2 font-bold" style={{ color: "#475569" }}>
                                        {sessionsCompleted} session{sessionsCompleted !== 1 ? "s" : ""} completed
                                    </span>
                                </div>
                            </div>

                            {/* Bottom grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl p-5 border"
                                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
                                        Focus Tip
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>💡 {tip}</p>
                                </div>
                                <div className="rounded-2xl p-5 border"
                                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
                                        How It Works
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { icon: Brain, text: `Study for ${durations.focus / 60} minutes` },
                                            { icon: Coffee, text: `Take a ${durations.short / 60} minute break` },
                                            { icon: CheckCircle, text: `After 4 sessions, take a ${durations.long / 60} minute break` },
                                        ].map(({ icon: Icon, text }, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                    style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
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

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
                    <div className="rounded-2xl border p-6 w-full max-w-sm"
                        style={{ background: "#0d1520", borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-white">Adjust Timer Durations</h3>
                            <button onClick={() => setShowSettings(false)}
                                className="p-1.5 rounded-lg transition-all"
                                style={{ color: "#64748b" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748b"}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {([
                                { key: "focus" as Mode, label: "Focus Session", min: 1, max: 60, color: "#22d3ee" },
                                { key: "short" as Mode, label: "Short Break", min: 1, max: 30, color: "#059669" },
                                { key: "long" as Mode, label: "Long Break", min: 1, max: 60, color: "#818cf8" },
                            ] as const).map(({ key, label, min, max, color: c }) => (
                                <div key={key}>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold" style={{ color: "#94a3b8" }}>{label}</label>
                                        <span className="text-xs font-black" style={{ color: c }}>{tempDurations[key]} min</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={min}
                                        max={max}
                                        value={tempDurations[key]}
                                        onChange={e => setTempDurations(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                        style={{ accentColor: c, background: `linear-gradient(to right, ${c} ${((tempDurations[key] - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0%)` }}
                                    />
                                    <div className="flex justify-between text-[10px] mt-1" style={{ color: "#334155" }}>
                                        <span>{min}m</span>
                                        <span>{max}m</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowSettings(false)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all"
                                style={{ borderColor: "rgba(255,255,255,0.1)", color: "#64748b" }}>
                                Cancel
                            </button>
                            <button onClick={saveSettings}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", color: "#080d14" }}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}