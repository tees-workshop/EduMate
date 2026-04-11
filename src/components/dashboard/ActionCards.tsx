"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileQuestion, Plus, Check, Trash2, Zap, FileText, File, FolderOpen, Brain } from "lucide-react";
import { useReadinessScore } from "@/hooks/useReadinessScore";
import { useUser } from "@/hooks/useUser";
import { db, Material, Task } from "@/lib/db";

function ToDoCard({ userId }: { userId: string }) {
    const [todos, setTodos] = useState<Task[]>([]);

    const loadTasks = async () => {
        if (!userId) return;
        db.getTasksByUser(userId).then(setTodos).catch(console.error);
    };

    useEffect(() => {
        loadTasks();
        window.addEventListener("tasks-updated", loadTasks);
        return () => window.removeEventListener("tasks-updated", loadTasks);
    }, [userId]);

    const toggle = async (id: string) => {
        const updated = todos.map((t) => t.id === id ? { ...t, done: !t.done } : t);
        setTodos(updated);
        const task = updated.find(t => t.id === id);
        if (task) {
            await db.saveTask(task);
            window.dispatchEvent(new Event("tasks-updated"));
        }
    };

    const pending = todos.filter(t => !t.done);
    const completed = todos.filter(t => t.done);

    return (
        <div className="rounded-2xl p-5 border flex flex-col"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
            }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                        style={{ background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.2)" }}>
                        ✅
                    </span>
                    To-Do List
                </h3>
                {pending.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                            background: "rgba(249,115,22,0.1)",
                            color: "#f97316",
                            border: "1px solid rgba(249,115,22,0.2)"
                        }}>
                        {pending.length} pending
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col rounded-xl border border-dashed p-4 min-h-30"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                {todos.length > 0 ? (
                    <div className="space-y-2 w-full">
                        {pending.slice(0, 4).map((todo) => (
                            <div key={todo.id} className="flex items-center gap-3">
                                <button
                                    onClick={() => toggle(todo.id)}
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                                    style={{
                                        borderColor: "#475569",
                                        background: "transparent"
                                    }}
                                >
                                    <Check className="w-3 h-3" style={{ color: "transparent" }} />
                                </button>
                                <span className="text-xs truncate" style={{ color: "#94a3b8" }}>
                                    {todo.text}
                                </span>
                            </div>
                        ))}
                        {completed.slice(0, 2).map((todo) => (
                            <div key={todo.id} className="flex items-center gap-3 opacity-50">
                                <button
                                    onClick={() => toggle(todo.id)}
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                                    style={{ borderColor: "#059669", background: "#059669" }}
                                >
                                    <Check className="w-3 h-3 text-white" />
                                </button>
                                <span className="text-xs truncate" style={{ color: "#475569", textDecoration: "line-through" }}>
                                    {todo.text}
                                </span>
                            </div>
                        ))}
                        {todos.length > 6 && (
                            <p className="text-[10px]" style={{ color: "#475569" }}>+{todos.length - 6} more</p>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
                            Stay Focused
                        </p>
                        <p className="text-[10px]" style={{ color: "#475569" }}>
                            No tasks yet. Add one in the library!
                        </p>
                    </div>
                )}
            </div>
            <Link href="/library" className="mt-4 text-xs font-bold transition-colors"
                style={{ color: "#22d3ee" }}>
                Manage all tasks →
            </Link>
        </div>
    );
}

function MaterialsCard({ userId }: { userId: string }) {
    const [materials, setMaterials] = useState<Material[]>([]);

    useEffect(() => {
        if (!userId) return;
        db.getMaterialsByUser(userId).then(setMaterials).catch(console.error);
    }, [userId]);

    const getIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="w-4 h-4" style={{ color: "#f87171" }} />;
        return <File className="w-4 h-4" style={{ color: "#94a3b8" }} />;
    };

    return (
        <div className="rounded-2xl p-5 border flex flex-col"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)"
            }}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" style={{ color: "#059669" }} />
                    Study Materials
                </h3>
                {materials.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                            background: "rgba(5,150,105,0.15)",
                            color: "#059669",
                            border: "1px solid rgba(5,150,105,0.2)"
                        }}>
                        {materials.length} files
                    </span>
                )}
            </div>
            <div className="flex-1 flex flex-col rounded-xl border border-dashed p-3 min-h-30"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                {materials.length > 0 ? (
                    <div className="space-y-2">
                        {materials.slice(0, 4).map((mat) => (
                            <div key={mat.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                {getIcon(mat.type)}
                                <span className="text-xs text-white truncate flex-1">{mat.name}</span>
                                <span className="text-[10px] shrink-0" style={{ color: "#475569" }}>{mat.size}</span>
                            </div>
                        ))}
                        {materials.length > 4 && (
                            <p className="text-[10px] text-center pt-1" style={{ color: "#475569" }}>
                                +{materials.length - 4} more
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                        <Trash2 className="w-6 h-6 mb-2" style={{ color: "#334155" }} />
                        <p className="text-[10px]" style={{ color: "#475569" }}>Locker is empty.</p>
                    </div>
                )}
            </div>
            <Link href="/library" className="mt-4 text-xs font-bold" style={{ color: "#059669" }}>
                Open Library →
            </Link>
        </div>
    );
}

export default function ActionCards() {
    const { score, label } = useReadinessScore();
    const { user } = useUser();

    const scoreColor = score === null ? "#64748b" : score >= 70 ? "#059669" : score >= 50 ? "#f97316" : "#f87171";
    const scoreGlow = score === null ? "rgba(100,116,139,0.15)" : score >= 70 ? "rgba(5,150,105,0.15)" : score >= 50 ? "rgba(249,115,22,0.15)" : "rgba(248,113,113,0.15)";

    return (
        <div className="space-y-5">

            {/* Hero Card */}
            <div className="rounded-2xl p-5 md:p-7 border relative overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)",
                    boxShadow: "0 4px 40px rgba(0,0,0,0.2)"
                }}>
                <div className="absolute top-0 right-0 w-50 h-50 rounded-full pointer-events-none"
                    style={{ background: "#22d3ee", filter: "blur(80px)", opacity: 0.04 }} />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border"
                        style={{ background: "rgba(34,211,238,0.08)", borderColor: "rgba(34,211,238,0.2)" }}>
                        <Zap className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#22d3ee" }}>
                            Intelligent Prep
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-white mb-2">Master Your Subjects</h3>
                            <p className="text-sm leading-relaxed mb-5" style={{ color: "#64748b" }}>
                                Run your readiness check or generate AI-powered quizzes to test your knowledge before assessments.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/library"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                    style={{
                                        background: "linear-gradient(135deg, #22d3ee, #059669)",
                                        color: "#080d14",
                                        boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                                    }}>
                                    <Plus className="w-4 h-4" /> Add Material
                                </Link>
                                <Link href="/dashboard/quizzes"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border hover:scale-105"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        borderColor: "rgba(255,255,255,0.1)",
                                        color: "#f1f5f9"
                                    }}>
                                    <FileQuestion className="w-4 h-4" /> AI Quizzer
                                </Link>
                            </div>
                        </div>

                        {/* Readiness Panel */}
                        <Link href="/dashboard/readiness"
                            className="rounded-xl p-5 border block transition-all hover:scale-[1.02]"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                borderColor: "rgba(255,255,255,0.07)"
                            }}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
                                    Readiness Score
                                </p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                    style={{
                                        background: scoreGlow,
                                        borderColor: scoreColor + "40",
                                        color: scoreColor
                                    }}>
                                    {label ?? "Not checked"}
                                </span>
                            </div>

                            {/* Score circle */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16 shrink-0">
                                    <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                                        <circle cx="32" cy="32" r="28" fill="none"
                                            stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                        <circle cx="32" cy="32" r="28" fill="none"
                                            stroke={scoreColor} strokeWidth="6"
                                            strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 28}
                                            strokeDashoffset={2 * Math.PI * 28 * (1 - (score ?? 0) / 100)}
                                            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${scoreColor})` }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-black text-white">{score ?? 0}%</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-2 rounded-full overflow-hidden mb-2"
                                        style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${score ?? 0}%`,
                                                background: `linear-gradient(90deg, ${scoreColor}, #22d3ee)`,
                                                boxShadow: `0 0 8px ${scoreColor}66`
                                            }} />
                                    </div>
                                    <p className="text-xs" style={{ color: "#64748b" }}>
                                        {score === null
                                            ? "Take a readiness check to get started"
                                            : score >= 70
                                                ? "Well prepared — keep it up!"
                                                : score >= 50
                                                    ? "Getting there — keep studying!"
                                                    : "More study needed before your exam"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                <Brain className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                                <span style={{ color: "#22d3ee" }} className="font-bold">Click to check readiness</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Secondary grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ToDoCard userId={user?.id ?? ""} />
                <MaterialsCard userId={user?.id ?? ""} />
            </div>
        </div>
    );
}