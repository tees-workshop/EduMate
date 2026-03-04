"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Brain, CheckCircle, XCircle, ChevronRight, BarChart3, HelpCircle } from "lucide-react";

interface BaselineResult {
    label: number;
    confidence: number;
    ready: boolean;
    inputs: {
        hoursStudied: number;
        previousScores: number;
        sleepHours: number;
        practicePapers: number;
    };
    timestamp: number;
}

export default function ResultsPage() {
    const router = useRouter();
    const [baseline, setBaseline] = useState<BaselineResult | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("baseline_result");
        if (!stored) {
            router.push("/dashboard/readiness");
            return;
        }
        setBaseline(JSON.parse(stored));
    }, [router]);

    if (!baseline) return null;

    const confidencePct = Math.round(baseline.confidence * 100);

    const explanations = [
        {
            label: "Hours Studied",
            value: baseline.inputs.hoursStudied,
            max: 10,
            good: baseline.inputs.hoursStudied >= 5,
            note: baseline.inputs.hoursStudied >= 5 ? "Good study time logged" : "Consider studying more before your assessment",
        },
        {
            label: "Previous Score",
            value: baseline.inputs.previousScores,
            max: 100,
            good: baseline.inputs.previousScores >= 60,
            note: baseline.inputs.previousScores >= 60 ? "Strong prior performance" : "Prior scores suggest knowledge gaps",
        },
        {
            label: "Sleep Hours",
            value: baseline.inputs.sleepHours,
            max: 10,
            good: baseline.inputs.sleepHours >= 6,
            note: baseline.inputs.sleepHours >= 6 ? "Well rested for optimal recall" : "Low sleep may affect performance",
        },
        {
            label: "Practice Papers",
            value: baseline.inputs.practicePapers,
            max: 10,
            good: baseline.inputs.practicePapers >= 2,
            note: baseline.inputs.practicePapers >= 2 ? "Good exam practice" : "More practice papers recommended",
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title="Readiness Results" />
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Verdict card */}
                        <div className={`rounded-3xl p-8 border shadow-sm relative overflow-hidden ${baseline.ready
                            ? "bg-green-50 border-green-100"
                            : "bg-red-50 border-red-100"
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${baseline.ready ? "bg-green-500" : "bg-red-500"}`}>
                                    {baseline.ready
                                        ? <CheckCircle className="w-8 h-8 text-white" />
                                        : <XCircle className="w-8 h-8 text-white" />
                                    }
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Baseline Prediction</p>
                                    <h2 className="text-3xl font-black text-slate-900">
                                        {baseline.ready ? "Likely Ready" : "Not Ready Yet"}
                                    </h2>
                                    <p className={`text-sm font-bold mt-1 ${baseline.ready ? "text-green-600" : "text-red-600"}`}>
                                        {confidencePct}% confidence based on your study habits
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* XAI Breakdown */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-indigo-500" />
                                Why this prediction? (Explainable AI)
                            </h3>
                            <div className="space-y-4">
                                {explanations.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {item.good
                                                    ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                    : <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                }
                                                <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                            </div>
                                            <span className="text-xs font-black text-slate-500">
                                                {item.value} / {item.max}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                                            <div
                                                className={`h-full rounded-full transition-all ${item.good ? "bg-green-400" : "bg-red-400"}`}
                                                style={{ width: `${(item.value / item.max) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium">{item.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Next step */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" />
                                Next Step — Validate with a Quiz
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                This was your habit-based baseline. Take an AI-generated quiz from your study material to get your final readiness verdict.
                            </p>
                            <button
                                onClick={() => router.push("/dashboard/quizzes")}
                                className="w-full gradient-bg text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <Brain className="w-4 h-4" /> Take the AI Quiz <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}