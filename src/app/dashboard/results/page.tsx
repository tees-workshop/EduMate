"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Brain, CheckCircle, XCircle, ChevronRight, BarChart3, HelpCircle, Trophy } from "lucide-react";

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

interface QuizResult {
    scorePercent: number;
    questionsCorrect: number;
    questionsWrong: number;
    avgTimePerQuestion: number;
    hintsUsed: number;
    consistencyScore: number;
    confidenceAvg: number;
}

export default function ResultsPage() {
    const router = useRouter();
    const [baseline, setBaseline] = useState<BaselineResult | null>(null);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [quizPrediction, setQuizPrediction] = useState<{ ready: boolean; confidence: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedBaseline = sessionStorage.getItem("baseline_result");
        const storedQuiz = sessionStorage.getItem("quiz_result");

        // If neither exists, redirect to readiness
        if (!storedBaseline && !storedQuiz) {
            router.push("/dashboard/readiness");
            return;
        }

        if (storedBaseline) setBaseline(JSON.parse(storedBaseline));
        if (storedQuiz) {
            const qr = JSON.parse(storedQuiz);
            setQuizResult(qr);
            runQuizModel(qr);
        } else {
            setLoading(false);
        }
    }, [router]);

    const runQuizModel = async (qr: QuizResult) => {
        try {
            const { predictQuizReadiness } = await import('@/lib/model');
            const result = await predictQuizReadiness({
                scorePercent: qr.scorePercent,
                questionsCorrect: qr.questionsCorrect,
                questionsWrong: qr.questionsWrong,
                avgTimePerQuestion: qr.avgTimePerQuestion,
                hintsUsed: qr.hintsUsed,
                consistencyScore: qr.consistencyScore,
                confidenceAvg: qr.confidenceAvg,
            });
            setQuizPrediction({ ready: result.ready, confidence: result.confidence });
        } catch (e) {
            console.error('Quiz model error:', e);
        } finally {
            setLoading(false);
        }
    };

    // Final verdict: if both exist, both must agree. If only one, use that.
    const getFinalVerdict = () => {
        if (baseline && quizPrediction) {
            // Both signals available — both must say ready
            const ready = baseline.ready && quizPrediction.ready;
            const confidence = Math.round(((baseline.confidence + quizPrediction.confidence) / 2) * 100);
            return { ready, confidence, source: 'both' };
        } else if (quizPrediction) {
            return { ready: quizPrediction.ready, confidence: Math.round(quizPrediction.confidence * 100), source: 'quiz' };
        } else if (baseline) {
            return { ready: baseline.ready, confidence: Math.round(baseline.confidence * 100), source: 'baseline' };
        }
        return null;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center"
                                    style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderColor: "rgba(255,255,255,0.07)",
                                    boxShadow: "0 4px 40px rgba(0,0,0,0.2)"
                                }}>
                    <div className="text-center">
                        <Brain className="w-10 h-10 text-white animate-pulse mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-500">Analysing your results...</p>
                    </div>
                </div>
            </div>
        );
    }

    const verdict = getFinalVerdict();
    if (!verdict) return null;

    const baselineExplanations = baseline ? [
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
    ] : [];

    const quizExplanations = quizResult ? [
        {
            label: "Quiz Score",
            value: quizResult.scorePercent,
            max: 100,
            good: quizResult.scorePercent >= 70,
            note: quizResult.scorePercent >= 70 ? "Strong quiz performance" : "Quiz score suggests knowledge gaps",
        },
        {
            label: "Avg Time Per Question",
            value: quizResult.avgTimePerQuestion,
            max: 120,
            good: quizResult.avgTimePerQuestion <= 45,
            note: quizResult.avgTimePerQuestion <= 45 ? "Good response speed" : "Slow responses may indicate uncertainty",
        },
        {
            label: "Hints Used",
            value: quizResult.hintsUsed,
            max: 10,
            good: quizResult.hintsUsed <= 2,
            note: quizResult.hintsUsed <= 2 ? "Answered mostly independently" : "Heavy hint usage suggests gaps",
        },
        {
            label: "Confidence",
            value: Math.round(quizResult.confidenceAvg * 10),
            max: 30,
            good: quizResult.confidenceAvg >= 2,
            note: quizResult.confidenceAvg >= 2 ? "Answered with good confidence" : "Low confidence in answers",
        },
    ] : [];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header title="Readiness Results" />
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Final Verdict */}
                        <div className={`rounded-3xl p-8 border shadow-sm relative overflow-hidden ${verdict.ready ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${verdict.ready ? "bg-green-500" : "bg-red-500"}`}>
                                    {verdict.ready
                                        ? <Trophy className="w-8 h-8 text-white" />
                                        : <XCircle className="w-8 h-8 text-white" />
                                    }
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                                        {verdict.source === 'both' ? 'Combined Verdict' : verdict.source === 'quiz' ? 'Quiz Verdict' : 'Baseline Verdict'}
                                    </p>
                                    <h2 className="text-3xl font-black text-slate-900">
                                        {verdict.ready ? "Ready!" : "Not Ready Yet"}
                                    </h2>
                                    <p className={`text-sm font-bold mt-1 ${verdict.ready ? "text-green-600" : "text-red-600"}`}>
                                        {verdict.confidence}% confidence
                                        {verdict.source === 'both' && " · based on habits + quiz performance"}
                                        {verdict.source === 'quiz' && " · based on quiz performance"}
                                        {verdict.source === 'baseline' && " · based on study habits"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Baseline Breakdown */}
                        {baseline && (
                            <div className="rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                                    Study Habits Analysis
                                </h3>
                                <div className="space-y-4">
                                    {baselineExplanations.map((item) => (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    {item.good
                                                        ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                        : <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                    }
                                                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-500">{item.value} / {item.max}</span>
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
                        )}

                        {/* Quiz Breakdown */}
                        {quizResult && (
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-indigo-500" />
                                    Quiz Performance Analysis
                                </h3>
                                <div className="space-y-4">
                                    {quizExplanations.map((item) => (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    {item.good
                                                        ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                        : <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                    }
                                                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-500">{item.value} / {item.max}</span>
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
                        )}

                        {/* Next steps */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-indigo-500" />
                                What's Next?
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {verdict.ready
                                    ? "You're showing strong readiness signals. Keep up the momentum!"
                                    : "Focus on the weak areas highlighted above before your assessment."}
                            </p>
                            <div className="flex gap-3">
                                {!quizResult && (
                                    <button
                                        onClick={() => router.push("/dashboard/quizzes")}
                                        className="flex-1 gradient-bg text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Brain className="w-4 h-4" /> Take Quiz <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {!baseline && (
                                    <button
                                        onClick={() => router.push("/dashboard/readiness")}
                                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        Do Baseline Check
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push("/dashboard")}
                                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}