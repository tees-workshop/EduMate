"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileQuestion, Calendar, FolderOpen, Plus, Check, Trash2, Zap, FileText, File } from "lucide-react";
import { useReadinessScore } from "@/hooks/useReadinessScore";
import { useUser } from "@/hooks/useUser";
import { db, Material, Task } from "@/lib/db";

function ToDoCard({ userId }: { userId: string }) {
    const [todos, setTodos] = useState<Task[]>([]);

    useEffect(() => {
        if (!userId) return;
        db.getTasksByUser(userId).then(setTodos).catch(console.error);
    }, [userId]);

    const toggle = async (id: string) => {
        const updated = todos.map((t) => t.id === id ? { ...t, done: !t.done } : t);
        setTodos(updated);
        const task = updated.find(t => t.id === id);
        if (task) await db.saveTask(task);
    };

    return (
        <div className="rounded-2xl p-5 border flex flex-col h-full transition-all duration-300"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
            }}>
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.2)" }}>
                    ✅
                </span>
                To-Do List
            </h3>
            <div className="flex-1 flex flex-col rounded-xl border border-dashed p-4"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                {todos.length > 0 ? (
                    <div className="space-y-2 w-full">
                        {todos.map((todo) => (
                            <div key={todo.id} className="flex items-center gap-3">
                                <button
                                    onClick={() => toggle(todo.id)}
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                                    style={{
                                        borderColor: todo.done ? "#059669" : "#475569",
                                        background: todo.done ? "#059669" : "transparent"
                                    }}
                                >
                                    {todo.done && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className="text-xs" style={{
                                    color: todo.done ? "#475569" : "#94a3b8",
                                    textDecoration: todo.done ? "line-through" : "none"
                                }}>
                                    {todo.text}
                                </span>
                            </div>
                        ))}
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
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                <FolderOpen className="w-4 h-4" style={{ color: "#059669" }} />
                Study Materials
                {materials.length > 0 && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                            background: "rgba(5,150,105,0.15)",
                            color: "#059669",
                            border: "1px solid rgba(5,150,105,0.2)"
                        }}>
                        {materials.length}
                    </span>
                )}
            </h3>
            <div className="flex-1 flex flex-col rounded-xl border border-dashed p-3"
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

    return (
        <div className="space-y-6">
            {/* Main card */}
            <div className="rounded-2xl p-6 md:p-8 border relative overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)",
                    boxShadow: "0 4px 40px rgba(0,0,0,0.2)"
                }}>
                <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full pointer-events-none"
                    style={{
                        background: "#22d3ee",
                        filter: "blur(80px)",
                        opacity: 0.04,
                    }} />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 border"
                            style={{
                                background: "rgba(34,211,238,0.08)",
                                borderColor: "rgba(34,211,238,0.2)"
                            }}>
                            <Zap className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#22d3ee" }}>
                                Intelligent Prep
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Master Your Subjects</h3>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748b" }}>
                            Run your weekly readiness check or generate AI-powered quizzes based on your latest uploads.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/library"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#080d14",
                                    boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                                }}>
                                <Plus className="w-4 h-4" /> Add Material
                            </Link>
                            <Link href="/dashboard/quizzes"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border hover:scale-105"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    color: "#f1f5f9"
                                }}>
                                <FileQuestion className="w-4 h-4" /> AI Quizzer
                            </Link>
                        </div>
                    </div>

                    {/* Performance panel */}
                    <div className="rounded-xl p-5 border"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.07)"
                        }}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
                                Last Performance
                            </p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                                style={{
                                    background: "rgba(34,211,238,0.08)",
                                    borderColor: "rgba(34,211,238,0.2)",
                                    color: "#22d3ee"
                                }}>
                                {label ?? "New Start"}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-white mb-2">
                                    <span>Readiness Score</span>
                                    <span>{score !== null ? `${score}%` : "0%"}</span>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden"
                                    style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${score ?? 0}%`,
                                            background: "linear-gradient(90deg, #22d3ee, #059669)",
                                            boxShadow: "0 0 8px rgba(34,211,238,0.4)"
                                        }} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "#64748b" }}>
                                <span className="font-bold" style={{ color: "#22d3ee" }}>AI Note:</span>
                                {score === null
                                    ? "Upload your first document to calculate readiness!"
                                    : score >= 70
                                        ? "You're looking well prepared. Keep it up!"
                                        : "Keep studying — you're making progress!"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Schedule */}
                {/* <div className="rounded-2xl p-5 border flex flex-col"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.07)"
                    }}>
                    <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: "#818cf8" }} />
                        Today&apos;s Schedule
                    </h3>
                    <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-dashed p-4"
                        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
                            Free Day
                        </p>
                        <p className="text-[10px]" style={{ color: "#475569" }}>No sessions scheduled yet.</p>
                    </div>
                    <Link href="/library" className="mt-4 text-xs font-bold" style={{ color: "#818cf8" }}>
                        Full calendar →
                    </Link>
                </div> */}

                {/* To-Do */}
                <ToDoCard userId={user?.id ?? ""} />

                {/* Materials */}
                <MaterialsCard userId={user?.id ?? ""} />
            </div>
        </div>
    );
}
