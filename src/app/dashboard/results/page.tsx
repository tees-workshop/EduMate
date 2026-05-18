"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Brain, CheckCircle, XCircle, ChevronRight, BarChart3, HelpCircle, Trophy, Loader2 } from "lucide-react";

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
            const { predictQuizReadiness } = await import("@/lib/model");
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
            console.error("Quiz model error:", e);
        } finally {
            setLoading(false);
        }
    };

    const getFinalVerdict = () => {
        if (baseline && quizPrediction) {
            const ready = baseline.ready && quizPrediction.ready;
            const confidence = Math.round(((baseline.confidence + quizPrediction.confidence) / 2) * 100);
            return { ready, confidence, source: "both" };
        } else if (quizPrediction) {
            return { ready: quizPrediction.ready, confidence: Math.round(quizPrediction.confidence * 100), source: "quiz" };
        } else if (baseline) {
            return { ready: baseline.ready, confidence: Math.round(baseline.confidence * 100), source: "baseline" };
        }
        return null;
    };

    // ── Loading state ──────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex min-h-screen relative theme-bg theme-text">
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
                </div>
                <Sidebar />
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", boxShadow: "0 8px 24px rgba(34,211,238,0.3)" }}>
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <p className="text-sm font-bold theme-text mb-1">Analysing your results...</p>
                        <p className="text-xs theme-text-muted">Running readiness model</p>
                    </div>
                </div>
            </div>
        );
    }

    const verdict = getFinalVerdict();
    if (!verdict) return null;

    const verdictReady = verdict.ready;
    const verdictColor = verdictReady ? "#059669" : "#f87171";
    const verdictGlow  = verdictReady ? "rgba(5,150,105,0.15)" : "rgba(248,113,113,0.15)";

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
        <div className="flex min-h-screen relative theme-bg">

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
                    style={{ background: verdictColor, filter: "blur(130px)", opacity: 0.06, bottom: "-80px", right: "-80px", animation: "driftA2 10s ease-in-out infinite" }} />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{ background: "#818cf8", filter: "blur(120px)", opacity: 0.05, top: "40%", left: "50%", transform: "translate(-50%,-50%)", animation: "driftA3 12s ease-in-out infinite" }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Readiness Results" />
                    <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pt-16 md:pt-6">
                        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">

                            {/* ── Final Verdict ─────────────────────────────── */}
                            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 border relative overflow-hidden"
                                style={{
                                    background: verdictReady ? "rgba(5,150,105,0.08)" : "rgba(248,113,113,0.08)",
                                    borderColor: verdictReady ? "rgba(5,150,105,0.25)" : "rgba(248,113,113,0.25)",
                                    boxShadow: `0 8px 40px ${verdictGlow}`
                                }}>
                                {/* Glow blob */}
                                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
                                    style={{ background: verdictColor, filter: "blur(60px)", opacity: 0.12 }} />

                                <div className="relative z-10 flex items-center gap-4 sm:gap-5">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: verdictReady
                                                ? "linear-gradient(135deg, #059669, #22d3ee)"
                                                : "linear-gradient(135deg, #f87171, #f97316)",
                                            boxShadow: `0 8px 24px ${verdictColor}55`
                                        }}>
                                        {verdictReady
                                            ? <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                            : <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#64748b" }}>
                                            {verdict.source === "both" ? "Combined Verdict" : verdict.source === "quiz" ? "Quiz Verdict" : "Baseline Verdict"}
                                        </p>
                                        <h2 className="text-2xl sm:text-3xl font-black theme-text">
                                            {verdictReady ? "Ready!" : "Not Ready Yet"}
                                        </h2>
                                        <p className="text-sm font-bold mt-1" style={{ color: verdictColor }}>
                                            {verdict.confidence}% confidence
                                            {verdict.source === "both" && " · habits + quiz"}
                                            {verdict.source === "quiz"  && " · quiz performance"}
                                            {verdict.source === "baseline" && " · study habits"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Baseline Breakdown ────────────────────────── */}
                            {baseline && (
                                <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border theme-card">
                                    <h3 className="text-sm font-black theme-text mb-4 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
                                            <BarChart3 className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                                        </div>
                                        Study Habits Analysis
                                    </h3>
                                    <div className="space-y-4">
                                        {baselineExplanations.map((item) => (
                                            <MetricRow key={item.label} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Quiz Breakdown ────────────────────────────── */}
                            {quizResult && (
                                <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border theme-card">
                                    <h3 className="text-sm font-black theme-text mb-4 flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.2)" }}>
                                            <Brain className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
                                        </div>
                                        Quiz Performance Analysis
                                    </h3>
                                    <div className="space-y-4">
                                        {quizExplanations.map((item) => (
                                            <MetricRow key={item.label} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── What's Next ───────────────────────────────── */}
                            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border theme-card">
                                <h3 className="text-sm font-black theme-text mb-2 flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)" }}>
                                        <HelpCircle className="w-3.5 h-3.5" style={{ color: "#059669" }} />
                                    </div>
                                    What&apos;s Next?
                                </h3>
                                <p className="text-xs leading-relaxed mb-4" style={{ color: "#64748b" }}>
                                    {verdictReady
                                        ? "You're showing strong readiness signals. Keep up the momentum!"
                                        : "Focus on the weak areas highlighted above before your assessment."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {!quizResult && (
                                        <button
                                            onClick={() => router.push("/dashboard/quizzes")}
                                            className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            style={{
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#fff",
                                                boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                                            }}>
                                            <Brain className="w-4 h-4" /> Take Quiz <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {!baseline && (
                                        <button
                                            onClick={() => router.push("/dashboard/readiness")}
                                            className="flex-1 py-3 rounded-2xl border text-sm font-bold transition-all hover:opacity-80 theme-card theme-text"
                                        >
                                            Do Baseline Check
                                        </button>
                                    )}
                                    <button
                                        onClick={() => router.push("/dashboard")}
                                        className="flex-1 py-3 rounded-2xl border text-sm font-bold transition-all hover:opacity-80 theme-card theme-text"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </div>

                            <div className="h-4 sm:h-0" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

// ── Metric row component ────────────────────────────────────────────
function MetricRow({ item }: {
    item: { label: string; value: number; max: number; good: boolean; note: string };
}) {
    const fillPct = Math.min(100, (item.value / item.max) * 100);
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    {item.good
                        ? <CheckCircle className="w-3.5 h-3.5" style={{ color: "#059669" }} />
                        : <XCircle    className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                    }
                    <span className="text-xs font-bold theme-text">{item.label}</span>
                </div>
                <span className="text-xs font-black" style={{ color: "#64748b" }}>
                    {item.value} / {item.max}
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-1"
                style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${fillPct}%`,
                        background: item.good
                            ? "linear-gradient(90deg, #059669, #22d3ee)"
                            : "linear-gradient(90deg, #f87171, #f97316)"
                    }} />
            </div>
            <p className="text-[10px] font-medium" style={{ color: "#475569" }}>{item.note}</p>
        </div>
    );
}