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

            // Store result in sessionStorage to pass to results page
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
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title="Readiness Check" />
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-2xl mx-auto">

                        {/* Header card */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Pre-Assessment Check</h2>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Answer honestly — our AI uses your study habits to predict your baseline readiness before you take the quiz.
                                </p>
                            </div>
                        </div>

                        {/* Form fields */}
                        <div className="space-y-4 mb-6">
                            {fields.map((field) => {
                                const Icon = field.icon;
                                const value = inputs[field.key as keyof HabitInputs];
                                return (
                                    <div key={field.key} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                    <Icon className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{field.label}</p>
                                                    <p className="text-xs text-slate-400">{field.description}</p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-black text-indigo-600 min-w-[3rem] text-right">
                                                {field.format(value)}
                                            </span>
                                        </div>
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
                                            className="w-full accent-indigo-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                            <span>{field.min}</span>
                                            <span>{field.max}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full gradient-bg text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Analysing your profile...</>
                            ) : (
                                <><Brain className="w-4 h-4" /> Run Baseline Prediction <ChevronRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}