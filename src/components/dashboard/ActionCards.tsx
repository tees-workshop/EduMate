"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Play, FileQuestion, Calendar, Trophy, FolderOpen, Plus, Check, Trash2, Zap } from "lucide-react";

// Shared data for demo - Now empty for fresh start
const initialTodos: { id: number; text: string; done: boolean }[] = [];

function ToDoCard() {
    const [todos, setTodos] = useState(initialTodos);

    const toggle = (id: number) =>
        setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center text-xs">✅</span>
                To-Do List
            </h3>
            <div className="space-y-4 flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                {todos.length > 0 ? (
                    <div className="space-y-2 w-full">
                        {todos.map((todo) => (
                            <div key={todo.id} className="flex items-center gap-3">
                                <button
                                    onClick={() => toggle(todo.id)}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${todo.done ? "border-green-500 bg-green-500" : "border-slate-300"
                                        }`}
                                >
                                    {todo.done && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className={`text-xs ${todo.done ? "line-through text-slate-400" : "text-slate-600 font-medium"}`}>
                                    {todo.text}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Focused</p>
                        <p className="text-[10px] text-slate-400 font-medium">No tasks for today. Add one in the library!</p>
                    </div>
                )}
            </div>
            <Link href="/library" className="mt-4 text-xs font-bold text-indigo-600 hover:underline">Manage all tasks →</Link>
        </div>
    );
}

export default function ActionCards() {
    return (
        <div className="space-y-6">
            {/* MERGED: Intelligent Preparation Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-4">
                            <Zap className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Intelligent prep</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Master Your Subjects</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Run your weekly readiness check or generate AI-powered quizzes based on your latest uploads.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/library" className="gradient-bg text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Material
                            </Link>
                            <Link href="/dashboard/quizzes" className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
                                <FileQuestion className="w-4 h-4" /> AI Quizzer
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Last Performance</p>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">New Start</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                                    <span>Readiness Score</span>
                                    <span>0%</span>
                                </div>
                                <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                                    <div className="h-full gradient-bg w-[0%] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium italic">
                                <span className="text-indigo-400 font-bold">AI Note:</span>
                                Upload your first document to calculate readiness!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid for Secondary Info */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Schedule */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        Today&apos;s Schedule
                    </h3>
                    <div className="space-y-4 flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Free Day</p>
                            <p className="text-[10px] text-slate-400 font-medium">No sessions scheduled yet.</p>
                        </div>
                    </div>
                    <Link href="/library" className="mt-4 text-xs font-bold text-indigo-600 hover:underline">Full calendar →</Link>
                </div>

                {/* To-Do List */}
                <ToDoCard />

                {/* Resources Preview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-indigo-500" />
                        Study Materials
                    </h3>
                    <div className="space-y-3 flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-4">
                        <div className="text-center">
                            <Trash2 className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                            <p className="text-[10px] text-slate-400 font-medium">Locker is empty.</p>
                        </div>
                    </div>
                    <Link href="/library" className="mt-4 text-xs font-bold text-indigo-600 hover:underline">Open Library →</Link>
                </div>
            </div>
        </div>
    );
}
