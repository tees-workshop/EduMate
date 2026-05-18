"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Clock, Plus, Trash2, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { db, Task } from "@/lib/db";
import { useUser } from "@/hooks/useUser";

export default function Reminders() {
    const { user } = useUser();
    const [reminders, setReminders] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newReminder, setNewReminder] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    const loadReminders = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await db.getTasksByUser(user.id);
            setReminders(data.sort((a, b) => b.timestamp - a.timestamp));
        } catch (error) {
            console.error("Failed to load reminders", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) loadReminders();
    }, [user, loadReminders]);

    const handleAddReminder = async () => {
        if (!newReminder.trim() || !user) return;
        const task: Task = {
            id: crypto.randomUUID(),
            userId: user.id,
            text: newReminder.trim(),
            done: false,
            timestamp: Date.now(),
        };
        await db.saveTask(task);
        setNewReminder("");
        setShowAddForm(false);
        loadReminders();
    };

    const toggleTask = async (task: Task) => {
        await db.saveTask({ ...task, done: !task.done });
        loadReminders();
    };

    const removeReminder = async (id: string) => {
        await db.deleteTask(id);
        loadReminders();
    };

    const pending = reminders.filter(r => !r.done);
    const completed = reminders.filter(r => r.done);

    return (
        <div className="space-y-5">

            {/* Header card */}
            <div className="rounded-2xl p-5 border"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)"
                }}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bell className="w-4 h-4" style={{ color: "#22d3ee" }} />
                        Manage Reminders
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
                    </h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            color: "#080d14"
                        }}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div className="flex gap-2 mb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <input
                            type="text"
                            autoFocus
                            value={newReminder}
                            onChange={(e) => setNewReminder(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddReminder()}
                            placeholder="What do you need to remember?"
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#f1f5f9"
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                        <button
                            onClick={handleAddReminder}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                color: "#080d14"
                            }}>
                            Add
                        </button>
                    </div>
                )}

                {/* Pending Tasks */}
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="py-6 flex justify-center gap-1">
                            {[0, 150, 300].map(delay => (
                                <div key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                    style={{ background: "#22d3ee", animationDelay: `${delay}ms` }} />
                            ))}
                        </div>
                    ) : pending.length === 0 && completed.length === 0 ? (
                        <div className="py-12 text-center border-2 border-dashed rounded-2xl"
                            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)"
                                }}>
                                <Bell className="w-6 h-6" style={{ color: "#1e293b" }} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#334155" }}>
                                No Reminders
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#334155" }}>
                                Add a task to stay organized!
                            </p>
                        </div>
                    ) : (
                        <>
                            {pending.map((r) => (
                                <div key={r.id}
                                    className="flex items-center gap-3 p-4 rounded-xl border group transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.15)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"}
                                >
                                    <button
                                        onClick={() => toggleTask(r)}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all hover:scale-110"
                                        style={{
                                            background: "rgba(34,211,238,0.08)",
                                            border: "1px solid rgba(34,211,238,0.2)"
                                        }}>
                                        <Clock className="w-4 h-4" style={{ color: "#22d3ee" }} />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{r.text}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <Calendar className="w-3 h-3" style={{ color: "#475569" }} />
                                            <span className="text-xs" style={{ color: "#475569" }}>
                                                {new Date(r.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeReminder(r.id)}
                                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        style={{ color: "#475569" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Completed */}
                            {completed.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                                        style={{ color: "#334155" }}>
                                        Completed ({completed.length})
                                    </p>
                                    {completed.map((r) => (
                                        <div key={r.id}
                                            className="flex items-center gap-3 p-4 rounded-xl border group transition-all mb-2"
                                            style={{
                                                background: "rgba(255,255,255,0.01)",
                                                borderColor: "rgba(255,255,255,0.04)",
                                                opacity: 0.6
                                            }}>
                                            <button
                                                onClick={() => toggleTask(r)}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                                style={{
                                                    background: "rgba(5,150,105,0.1)",
                                                    border: "1px solid rgba(5,150,105,0.2)"
                                                }}>
                                                <CheckCircle2 className="w-4 h-4" style={{ color: "#059669" }} />
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate"
                                                    style={{ color: "#475569", textDecoration: "line-through" }}>
                                                    {r.text}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeReminder(r.id)}
                                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                style={{ color: "#475569" }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Tip card */}
            <div className="rounded-2xl p-5 border flex gap-4"
                style={{
                    background: "rgba(34,211,238,0.04)",
                    borderColor: "rgba(34,211,238,0.12)"
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.2)"
                    }}>
                    <AlertCircle className="w-5 h-5" style={{ color: "#22d3ee" }} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white mb-1">Study Recommendation</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                        {pending.length > 0
                            ? "You have active tasks! Consider using the focus timer for your next session."
                            : "New here? Start by adding your course deadlines or school projects above."}
                    </p>
                </div>
            </div>
        </div>
    );
}