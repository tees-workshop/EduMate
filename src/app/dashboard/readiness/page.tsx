"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Brain, ChevronRight, Loader2, BookOpen, Clock, FileText, Moon } from "lucide-react";
import { predictBaseline, HabitInputs } from "@/lib/model";

const fields = [
    {
        key: "hoursStudied",
        label: "Hours Studied",
        description: "How many hours have you studied this topic?",
        icon: BookOpen,
        min: 0, max: 10, step: 1,
        format: (v: number) => `${v} hrs`,
    },
    {
        key: "previousScores",
        label: "Previous Score",
        description: "What was your last test score on this subject?",
        icon: FileText,
        min: 0, max: 100, step: 1,
        format: (v: number) => `${v}%`,
    },
    {
        key: "sleepHours",
        label: "Sleep Hours",
        description: "How many hours did you sleep last night?",
        icon: Moon,
        min: 0, max: 10, step: 1,
        format: (v: number) => `${v} hrs`,
    },
    {
        key: "practicePapers",
        label: "Practice Papers Done",
        description: "How many practice papers have you completed?",
        icon: Clock,
        min: 0, max: 10, step: 1,
        format: (v: number) => `${v}`,
    },
];

export default function ReadinessPage() {
    const router = useRouter();
    const [inputs, setInputs] = useState<HabitInputs>({
        hoursStudied: 5,
        previousScores: 60,
        sleepHours: 7,
        practicePapers: 2,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await predictBaseline(inputs);
            sessionStorage.setItem("baseline_result", JSON.stringify({
                ...result,
                inputs,
                timestamp: Date.now(),
            }));
            router.push("/dashboard/results");
        } catch (err) {
            console.error(err);
            setError("Failed to run prediction. Make sure the model file is in /public.");
        } finally {
            setLoading(false);
        }
    };

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
                    style={{ background: "#22d3ee", filter: "blur(140px)", opacity: 0.08, top: "-100px", left: "-100px", animation: "driftA1 8s ease-in-out infinite" }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{ background: "#059669", filter: "blur(130px)", opacity: 0.07, bottom: "-80px", right: "-80px", animation: "driftA2 10s ease-in-out infinite" }} />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{ background: "#818cf8", filter: "blur(120px)", opacity: 0.06, top: "40%", left: "50%", transform: "translate(-50%, -50%)", animation: "driftA3 12s ease-in-out infinite" }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Readiness Check" />

                    <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pt-16 md:pt-6">
                        <div className="max-w-2xl mx-auto">

                            {/* Header card */}
                            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border mb-4 sm:mb-6 relative overflow-hidden"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)",
                                    boxShadow: "0 4px 40px rgba(0,0,0,0.2)"
                                }}>
                                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
                                    style={{ background: "#22d3ee", filter: "blur(80px)", opacity: 0.05 }} />
                                <div className="relative z-10">
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4"
                                        style={{
                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                            boxShadow: "0 4px 20px rgba(34,211,238,0.25)"
                                        }}>
                                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Pre-Assessment Check</h2>
                                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#64748b" }}>
                                        Answer honestly. Our AI uses your study habits to predict your baseline readiness before you take the quiz.
                                    </p>
                                </div>
                            </div>

                            {/* Form fields */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                {fields.map((field) => {
                                    const Icon = field.icon;
                                    const value = inputs[field.key as keyof HabitInputs];
                                    const fillPct = ((value - field.min) / (field.max - field.min)) * 100;

                                    return (
                                        <div key={field.key}
                                            className="rounded-2xl p-4 sm:p-5 md:p-6 border transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                borderColor: "rgba(255,255,255,0.07)",
                                                boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
                                            }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.15)"}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"}
                                        >
                                            {/* Field header */}
                                            <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
                                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0"
                                                        style={{
                                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                            boxShadow: "0 4px 12px rgba(34,211,238,0.2)"
                                                        }}>
                                                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-white">{field.label}</p>
                                                        <p className="text-[11px] sm:text-xs mt-0.5 leading-snug" style={{ color: "#64748b" }}>
                                                            {field.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-lg sm:text-xl font-black shrink-0"
                                                    style={{ color: "#22d3ee" }}>
                                                    {field.format(value)}
                                                </span>
                                            </div>

                                            {/* Slider */}
                                            <input
                                                type="range"
                                                min={field.min}
                                                max={field.max}
                                                step={field.step}
                                                value={value}
                                                onChange={(e) => setInputs(prev => ({
                                                    ...prev,
                                                    [field.key]: Number(e.target.value)
                                                }))}
                                                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, #22d3ee ${fillPct}%, rgba(255,255,255,0.08) ${fillPct}%)`,
                                                    accentColor: "#22d3ee",
                                                }}
                                            />
                                            <div className="flex justify-between text-[10px] mt-1.5 font-bold"
                                                style={{ color: "#475569" }}>
                                                <span>{field.min}</span>
                                                <span>{field.max}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="rounded-2xl px-4 py-3 mb-4 text-sm font-medium border"
                                    style={{
                                        background: "rgba(248,113,113,0.08)",
                                        borderColor: "rgba(248,113,113,0.2)",
                                        color: "#f87171"
                                    }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#ffffff",
                                    boxShadow: "0 8px 24px rgba(34,211,238,0.25)"
                                }}
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Analysing your profile...</>
                                ) : (
                                    <><Brain className="w-4 h-4" /> Run Baseline Prediction <ChevronRight className="w-4 h-4" /></>
                                )}
                            </button>

                            <div className="h-6 sm:h-0" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}