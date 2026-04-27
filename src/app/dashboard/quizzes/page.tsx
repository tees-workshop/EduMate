"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { db, Material } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import {
    Brain, Loader2, ChevronRight, ChevronLeft,
    FileText, CheckCircle, XCircle, Lightbulb, Clock, File
} from "lucide-react";

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface Answer {
    questionId: number;
    selected: number;
    correct: boolean;
    timeSpent: number;
    hintsUsed: number;
    confidence: number;
}

type Stage = 'select' | 'configure' | 'quiz' | 'done';

// Shared page shell
function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen relative theme-bg theme-text">
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
                    <Header title={title} />
                    <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto pt-16 md:pt-6">
                        <div className="max-w-2xl mx-auto">
                            {children}
                            <div className="h-6 sm:h-0" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function QuizPage() {
    const router = useRouter();
    const { user } = useUser();
    const [stage, setStage] = useState<Stage>('select');
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [questionCount, setQuestionCount] = useState(10);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [confidence, setConfidence] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const qStartTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        if (user) loadMaterials();
    }, [user]);

    const loadMaterials = async () => {
        if (!user) return;
        const data = await db.getMaterialsByUser(user.id);
        setMaterials(data.sort((a, b) => b.timestamp - a.timestamp));
    };

    const generateQuiz = async () => {
        if (!selectedMaterial) return;
        setLoading(true);
        setError("");
        try {
            const material = (selectedMaterial as any).extractedText || selectedMaterial.name;
            const res = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ material, questionCount })
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate quiz');
            setQuestions(data.questions);
            setStage('quiz');
            qStartTimeRef.current = Date.now();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = () => {
        if (selected === null || confidence === null) return;
        const timeSpent = Math.round((Date.now() - qStartTimeRef.current) / 1000);
        const isCorrect = selected === questions[currentQ].correct;
        const answer: Answer = { questionId: questions[currentQ].id, selected, correct: isCorrect, timeSpent, hintsUsed, confidence };
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        if (currentQ + 1 < questions.length) {
            setCurrentQ(currentQ + 1);
            setSelected(null);
            setShowHint(false);
            setHintsUsed(0);
            setConfidence(null);
            qStartTimeRef.current = Date.now();
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = (finalAnswers: Answer[]) => {
        const correct = finalAnswers.filter(a => a.correct).length;
        const wrong = finalAnswers.length - correct;
        const scorePercent = (correct / finalAnswers.length) * 100;
        const avgTime = finalAnswers.reduce((s, a) => s + a.timeSpent, 0) / finalAnswers.length;
        const totalHints = finalAnswers.reduce((s, a) => s + a.hintsUsed, 0);
        const avgConfidence = finalAnswers.reduce((s, a) => s + a.confidence, 0) / finalAnswers.length;
        const consistencyScore = finalAnswers.reduce((score, a, i) => {
            const expected = i < finalAnswers.length / 2 ? 1 : 0;
            return score + (a.correct === (expected === 1) ? 1 : 0);
        }, 0) / finalAnswers.length;

        sessionStorage.setItem('quiz_result', JSON.stringify({
            scorePercent: Math.round(scorePercent),
            questionsCorrect: correct,
            questionsWrong: wrong,
            avgTimePerQuestion: Math.round(avgTime),
            hintsUsed: totalHints,
            consistencyScore: Math.round(consistencyScore * 100) / 100,
            confidenceAvg: Math.round(avgConfidence * 100) / 100,
            answers: finalAnswers,
            questions,
        }));
        setStage('done');
    };

    const currentQuestion = questions[currentQ];
    const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;

    // ── Stage: Select Material ──────────────────────────────────────
    if (stage === 'select') {
        return (
            <PageShell title="AI Quiz Generator">
                {/* Hero card */}
                <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border mb-4 sm:mb-6 relative overflow-hidden theme-card">
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
                        <h2 className="text-xl sm:text-2xl font-black theme-text mb-2">AI Quiz Generator</h2>
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "#64748b" }}>
                            Pick a study material from your library. The AI will generate a custom quiz to test your readiness.
                        </p>
                    </div>
                </div>

                {/* Materials list */}
                <div className="space-y-3 mb-5 sm:mb-6">
                    {materials.length === 0 ? (
                        <div className="rounded-2xl sm:rounded-3xl p-10 sm:p-12 border text-center theme-card">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <FileText className="w-7 h-7" style={{ color: "#334155" }} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: "#334155" }}>
                                No materials yet
                            </p>
                            <p className="text-xs mb-5" style={{ color: "#334155" }}>
                                Go to Library and upload a document first
                            </p>
                            <button
                                onClick={() => router.push('/library')}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#fff",
                                    boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                }}>
                                Go to Library
                            </button>
                        </div>
                    ) : (
                        materials.map(m => {
                            const isSelected = selectedMaterial?.id === m.id;
                            return (
                                <div key={m.id}
                                    onClick={() => setSelectedMaterial(m)}
                                    className="rounded-2xl p-4 border-2 cursor-pointer transition-all flex items-center gap-3 sm:gap-4 theme-card"
                                    style={{
                                        background: isSelected ? "rgba(34,211,238,0.15)" : "var(--bg-card)",
                                        borderColor: isSelected ? "var(--grid-color)" : "var(--border)",
                                        boxShadow: isSelected ? "0 4px 20px rgba(34,211,238,0.1)" : "none"
                                    }}
                                    onMouseEnter={e => {
                                        if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--border-focus)";
                                    }}
                                    onMouseLeave={e => {
                                        if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                                    }}
                                >
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{
                                            background: isSelected ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.05)",
                                            border: `1px solid ${isSelected ? "rgba(34,211,238,0.25)" : "rgba(255,255,255,0.08)"}`
                                        }}>
                                        {m.type.includes("pdf")
                                            ? <FileText className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: isSelected ? "#22d3ee" : "#f87171" }} />
                                            : <File className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: isSelected ? "#22d3ee" : "#94a3b8" }} />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{m.name}</p>
                                        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                                            {m.type.split('/').pop()?.toUpperCase()} · {m.size}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <CheckCircle className="w-5 h-5 shrink-0" style={{ color: "#22d3ee" }} />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {selectedMaterial && (
                    <button
                        onClick={() => setStage('configure')}
                        className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            color: "#fff",
                            boxShadow: "0 8px 24px rgba(34,211,238,0.25)"
                        }}>
                        Continue <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </PageShell>
        );
    }

    // ── Stage: Configure ───────────────────────────────────────────
    if (stage === 'configure') {
        const fillPct = ((questionCount - 5) / (20 - 5)) * 100;
        return (
            <PageShell title="AI Quiz Generator">
                <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border theme-card">
                    <h2 className="text-xl sm:text-2xl font-black theme-text mb-1">Configure Your Quiz</h2>
                    <p className="text-xs sm:text-sm mb-6" style={{ color: "#64748b" }}>
                        Generating from:{" "}
                        <span className="font-bold" style={{ color: "#22d3ee" }}>{selectedMaterial?.name}</span>
                    </p>

                    {/* Question count slider */}
                    <div className="rounded-2xl p-5 border mb-6 theme-card">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold theme-text">Number of Questions</p>
                            <span className="text-2xl font-black" style={{ color: "#22d3ee" }}>{questionCount}</span>
                        </div>
                        <input
                            type="range"
                            min={5} max={20} step={5}
                            value={questionCount}
                            onChange={e => setQuestionCount(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #22d3ee ${fillPct}%, rgba(255,255,255,0.08) ${fillPct}%)`,
                                accentColor: "#22d3ee",
                            }}
                        />
                        <div className="flex justify-between text-[10px] mt-2 font-bold" style={{ color: "#475569" }}>
                            <span>5</span><span>10</span><span>15</span><span>20</span>
                        </div>
                    </div>

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

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStage('select')}
                            className="flex-1 py-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-80 theme-card theme-text"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                            onClick={generateQuiz}
                            disabled={loading}
                            className="flex-1 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                color: "#fff",
                                boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                            }}>
                            {loading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                : <><Brain className="w-4 h-4" /> Generate Quiz</>
                            }
                        </button>
                    </div>
                </div>
            </PageShell>
        );
    }

    // ── Stage: Quiz ────────────────────────────────────────────────
    if (stage === 'quiz' && currentQuestion) {
        return (
            <PageShell title="AI Quiz">
                <div className="space-y-3 sm:space-y-4">

                    {/* Progress bar */}
                    <div className="rounded-2xl p-4 border theme-card">
                        <div className="flex justify-between text-xs font-bold mb-2" style={{ color: "#64748b" }}>
                            <span>Question {currentQ + 1} of {questions.length}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> In progress
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                    background: "linear-gradient(90deg, #22d3ee, #059669)"
                                }} />
                        </div>
                    </div>

                    {/* Question card */}
                    <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border theme-card">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                            style={{ color: "var(--grid-color)" }}>
                            Question {currentQ + 1}
                        </p>
                        <p className="text-base sm:text-lg font-bold theme-text leading-relaxed mb-5 sm:mb-6">
                            {currentQuestion.question}
                        </p>

                        <div className="space-y-2 sm:space-y-3">
                            {currentQuestion.options.map((option, i) => {
                                const isSelected = selected === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelected(i)}
                                        className="w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all text-sm font-medium theme-card"
                                        style={{
                                            background: isSelected ? "rgba(34,211,238,0.15)" : "var(--bg-card)",
                                            borderColor: isSelected ? "var(--grid-color)" : "var(--border)",
                                            color: "var(--text)",
                                        }}
                                        onMouseEnter={e => {
                                            if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--border-focus)";
                                        }}
                                        onMouseLeave={e => {
                                            if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                                        }}
                                    >
                                        <span className="font-black mr-2 sm:mr-3" style={{ color: isSelected ? "#22d3ee" : "#475569" }}>
                                            {String.fromCharCode(65 + i)}.
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hint */}
                    <div className="rounded-2xl p-4 border theme-card">
                        <button
                            onClick={() => { setShowHint(true); setHintsUsed(h => h + 1); }}
                            disabled={showHint}
                            className="flex items-center gap-2 text-xs font-bold transition-colors disabled:opacity-50"
                            style={{ color: "#eab308" }}>
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? 'Hint shown' : 'Show hint'}
                        </button>
                        {showHint && (
                            <div className="mt-3 rounded-xl p-3 border text-xs leading-relaxed"
                                style={{
                                    background: "rgba(234,179,8,0.06)",
                                    borderColor: "rgba(234,179,8,0.15)",
                                    color: "#94a3b8"
                                }}>
                                💡 {currentQuestion.explanation}
                            </div>
                        )}
                    </div>

                    {/* Confidence */}
                    {selected !== null && (
                        <div className="rounded-2xl p-4 border theme-card">
                            <p className="text-xs font-bold theme-text mb-3">How confident are you?</p>
                            <div className="flex gap-2 sm:gap-3">
                                {[
                                    { value: 1, label: 'Not Sure',  activeBg: "rgba(248,113,113,0.12)", activeBorder: "rgba(248,113,113,0.3)", activeColor: "#f87171" },
                                    { value: 2, label: 'Somewhat',  activeBg: "rgba(234,179,8,0.12)",   activeBorder: "rgba(234,179,8,0.3)",   activeColor: "#eab308" },
                                    { value: 3, label: 'Confident', activeBg: "rgba(5,150,105,0.12)",   activeBorder: "rgba(5,150,105,0.3)",   activeColor: "#059669" },
                                ].map(c => (
                                    <button
                                        key={c.value}
                                        onClick={() => setConfidence(c.value)}
                                        className="flex-1 py-2 rounded-xl border-2 text-xs font-black transition-all theme-card"
                                        style={{
                                            background: confidence === c.value ? c.activeBg : "var(--bg-card)",
                                            borderColor: confidence === c.value ? c.activeColor : "var(--border)",
                                            color: confidence === c.value ? c.activeColor : "var(--text)",
                                            transform: confidence === c.value ? "scale(1.04)" : "scale(1)"
                                        }}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Next */}
                    {selected !== null && confidence !== null && (
                        <button
                            onClick={handleAnswer}
                            className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                color: "#fff",
                                boxShadow: "0 8px 24px rgba(34,211,238,0.25)"
                            }}>
                            {currentQ + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </PageShell>
        );
    }

    // ── Stage: Done ────────────────────────────────────────────────
    if (stage === 'done') {
        const correct = answers.filter(a => a.correct).length;
        const scorePercent = Math.round((correct / answers.length) * 100);
        const passed = scorePercent >= 70;

        return (
            <PageShell title="Quiz Complete">
                <div className="space-y-4 sm:space-y-5">

                    {/* Score card */}
                    <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 border relative overflow-hidden"
                        style={{
                            background: passed ? "rgba(5,150,105,0.08)" : "rgba(248,113,113,0.08)",
                            borderColor: passed ? "rgba(5,150,105,0.25)" : "rgba(248,113,113,0.25)",
                        }}>
                        <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full pointer-events-none"
                            style={{
                                background: passed ? "#059669" : "#f87171",
                                filter: "blur(70px)",
                                opacity: 0.12
                            }} />
                        <div className="relative z-10 flex items-center gap-4 sm:gap-5">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0"
                                style={{
                                    background: passed
                                        ? "linear-gradient(135deg, #059669, #22d3ee)"
                                        : "linear-gradient(135deg, #f87171, #f97316)",
                                    boxShadow: `0 8px 24px ${passed ? "rgba(5,150,105,0.3)" : "rgba(248,113,113,0.3)"}`
                                }}>
                                {passed
                                    ? <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                    : <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                }
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#64748b" }}>
                                    Quiz Complete
                                </p>
                                <h2 className="text-3xl sm:text-4xl font-black theme-text">{scorePercent}%</h2>
                                <p className="text-sm font-bold mt-0.5" style={{ color: "#64748b" }}>
                                    {correct} of {answers.length} correct
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[
                            { label: "Correct",   value: correct,               color: "#059669" },
                            { label: "Wrong",     value: answers.length - correct, color: "#f87171" },
                            { label: "Questions", value: answers.length,         color: "#22d3ee" },
                        ].map((s) => (
                            <div key={s.label} className="rounded-2xl p-3 sm:p-4 border text-center theme-card">
                                <p className="text-xl sm:text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px] sm:text-xs font-bold mt-0.5" style={{ color: "#475569" }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <button
                        onClick={() => router.push('/dashboard/results?source=quiz')}
                        className="w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            color: "#fff",
                            boxShadow: "0 8px 24px rgba(34,211,238,0.25)"
                        }}>
                        <Brain className="w-4 h-4" /> See Full Readiness Verdict <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => {
                            setStage('select');
                            setAnswers([]);
                            setQuestions([]);
                            setCurrentQ(0);
                            setSelected(null);
                            setConfidence(null);
                        }}
                        className="w-full py-3 rounded-2xl border text-sm font-bold transition-all hover:opacity-80 theme-card theme-text"
                    >
                        Take Another Quiz
                    </button>
                </div>
            </PageShell>
        );
    }

    return null;
}