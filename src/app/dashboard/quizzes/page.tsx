"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { db, Material } from "@/lib/db";
import { useUser } from "@/hooks/useUser";
import {
    Brain, Loader2, ChevronRight, ChevronLeft,
    FileText, CheckCircle, XCircle, Lightbulb, Clock
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
    const startTimeRef = useRef<number>(Date.now());
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
            // Extract text from base64 data if extractedText not available
            const material = selectedMaterial.extractedText || selectedMaterial.name;

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

        const answer: Answer = {
            questionId: questions[currentQ].id,
            selected,
            correct: isCorrect,
            timeSpent,
            hintsUsed,
            confidence,
        };

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

        // Consistency score: how predictable the pattern is (correct on early, wrong on later)
        const consistencyScore = finalAnswers.reduce((score, a, i) => {
            const expected = i < finalAnswers.length / 2 ? 1 : 0;
            return score + (a.correct === (expected === 1) ? 1 : 0);
        }, 0) / finalAnswers.length;

        const quizMetrics = {
            scorePercent: Math.round(scorePercent),
            questionsCorrect: correct,
            questionsWrong: wrong,
            avgTimePerQuestion: Math.round(avgTime),
            hintsUsed: totalHints,
            consistencyScore: Math.round(consistencyScore * 100) / 100,
            confidenceAvg: Math.round(avgConfidence * 100) / 100,
            answers: finalAnswers,
            questions,
        };

        sessionStorage.setItem('quiz_result', JSON.stringify(quizMetrics));
        setStage('done');
    };

    const currentQuestion = questions[currentQ];
    const progress = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

    // ── Stage: Select Material ──
    if (stage === 'select') {
        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="AI Quiz Generator" />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                                        <Brain className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">AI Quiz Generator</h2>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Pick a study material from your library. Claude will generate a custom quiz from it to test your readiness.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {materials.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center">
                                        <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">No materials uploaded yet</p>
                                        <p className="text-xs text-slate-400 mt-1">Go to Library and upload a document first</p>
                                        <button
                                            onClick={() => router.push('/library')}
                                            className="mt-4 gradient-bg text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                                        >
                                            Go to Library
                                        </button>
                                    </div>
                                ) : (
                                    materials.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => setSelectedMaterial(m)}
                                            className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all flex items-center gap-4 ${selectedMaterial?.id === m.id
                                                ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
                                                : 'border-slate-100 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-800 truncate">{m.name}</p>
                                                <p className="text-xs text-slate-400">{m.type.split('/').pop()?.toUpperCase()} • {m.size}</p>
                                            </div>
                                            {selectedMaterial?.id === m.id && (
                                                <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {selectedMaterial && (
                                <button
                                    onClick={() => setStage('configure')}
                                    className="w-full gradient-bg text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    Continue <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // ── Stage: Configure ──
    if (stage === 'configure') {
        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="AI Quiz Generator" />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <h2 className="text-xl font-black text-slate-900 mb-1">Configure Your Quiz</h2>
                                <p className="text-sm text-slate-500 mb-6">Generating from: <span className="font-bold text-indigo-600">{selectedMaterial?.name}</span></p>

                                <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-bold text-slate-700">Number of Questions</p>
                                        <span className="text-2xl font-black text-indigo-600">{questionCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={5} max={20} step={5}
                                        value={questionCount}
                                        onChange={e => setQuestionCount(Number(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                        <span>5</span><span>10</span><span>15</span><span>20</span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4 font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStage('select')}
                                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button
                                        onClick={generateQuiz}
                                        disabled={loading}
                                        className="flex-2 flex-1 gradient-bg text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:scale-100"
                                    >
                                        {loading ? (
                                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                        ) : (
                                            <><Brain className="w-4 h-4" /> Generate Quiz</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // ── Stage: Quiz ──
    if (stage === 'quiz' && currentQuestion) {
        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="AI Quiz" />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                        <div className="max-w-2xl mx-auto space-y-4">

                            {/* Progress */}
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                    <span>Question {currentQ + 1} of {questions.length}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> In progress</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full gradient-bg rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-3">Question {currentQ + 1}</p>
                                <p className="text-lg font-bold text-slate-900 leading-relaxed mb-6">{currentQuestion.question}</p>

                                <div className="space-y-3">
                                    {currentQuestion.options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelected(i)}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-sm font-medium ${selected === i
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-100 hover:border-slate-200 text-slate-700'
                                                }`}
                                        >
                                            <span className="font-black text-slate-400 mr-3">{String.fromCharCode(65 + i)}.</span>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Hint */}
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                <button
                                    onClick={() => { setShowHint(true); setHintsUsed(h => h + 1); }}
                                    disabled={showHint}
                                    className="flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 disabled:opacity-50 transition-colors"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    {showHint ? 'Hint shown' : 'Show hint (-1 point)'}
                                </button>
                                {showHint && (
                                    <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-amber-50 rounded-xl p-3 border border-amber-100">
                                        💡 {currentQuestion.explanation}
                                    </p>
                                )}
                            </div>

                            {/* Confidence */}
                            {selected !== null && (
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                    <p className="text-xs font-bold text-slate-700 mb-3">How confident are you in this answer?</p>
                                    <div className="flex gap-3">
                                        {[
                                            { value: 1, label: 'Not Sure', color: 'border-red-200 bg-red-50 text-red-600' },
                                            { value: 2, label: 'Somewhat', color: 'border-amber-200 bg-amber-50 text-amber-600' },
                                            { value: 3, label: 'Confident', color: 'border-green-200 bg-green-50 text-green-600' },
                                        ].map(c => (
                                            <button
                                                key={c.value}
                                                onClick={() => setConfidence(c.value)}
                                                className={`flex-1 py-2 rounded-xl border-2 text-xs font-black transition-all ${confidence === c.value
                                                    ? c.color + ' scale-105'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Next button */}
                            {selected !== null && confidence !== null && (
                                <button
                                    onClick={handleAnswer}
                                    className="w-full gradient-bg text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                >
                                    {currentQ + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // ── Stage: Done ──
    if (stage === 'done') {
        const correct = answers.filter(a => a.correct).length;
        const scorePercent = Math.round((correct / answers.length) * 100);

        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Quiz Complete" />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className={`rounded-3xl p-8 border shadow-sm ${scorePercent >= 70 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${scorePercent >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {scorePercent >= 70
                                            ? <CheckCircle className="w-8 h-8 text-white" />
                                            : <XCircle className="w-8 h-8 text-white" />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Quiz Complete</p>
                                        <h2 className="text-3xl font-black text-slate-900">{scorePercent}%</h2>
                                        <p className="text-sm font-bold text-slate-500">{correct} of {answers.length} correct</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/dashboard/results?source=quiz')}
                                className="w-full gradient-bg text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
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
                                className="w-full py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Take Another Quiz
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return null;
}