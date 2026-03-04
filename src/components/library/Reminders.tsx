"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, Plus, Trash2, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { db, Task } from "@/lib/db";
import { useUser } from "@/hooks/useUser";

export default function Reminders() {
    const { user } = useUser();
    const [reminders, setReminders] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newReminder, setNewReminder] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (user) {
            loadReminders();
        }
    }, [user]);

    const loadReminders = async () => {
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
    };

    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReminder.trim() || !user) return;

        const task: Task = {
            id: crypto.randomUUID(),
            userId: user.id,
            text: newReminder.trim(),
            done: false,
            timestamp: Date.now()
        };

        await db.saveTask(task);
        setNewReminder("");
        setShowAddForm(false);
        loadReminders();
    };

    const toggleTask = async (task: Task) => {
        const updatedTask = { ...task, done: !task.done };
        await db.saveTask(updatedTask);
        loadReminders();
    };

    const removeReminder = async (id: string) => {
        await db.deleteTask(id);
        loadReminders();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-indigo-500" />
                        Manage Reminders
                    </h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-8 h-8 rounded-full gradient-bg text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-110 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {showAddForm && (
                    <form onSubmit={handleAddReminder} className="mb-6 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                            type="text"
                            autoFocus
                            value={newReminder}
                            onChange={(e) => setNewReminder(e.target.value)}
                            placeholder="What do you need to remember?"
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        <button type="submit" className="gradient-bg text-white px-6 py-3 rounded-2xl text-sm font-bold">
                            Add
                        </button>
                    </form>
                )}

                <div className="grid gap-3">
                    {reminders.map((r) => (
                        <div key={r.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group ${r.done ? 'bg-slate-50/50 border-slate-50 opacity-60' : 'border-slate-50 bg-slate-50 hover:border-indigo-100 hover:bg-white'}`}>
                            <button
                                onClick={() => toggleTask(r)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${r.done ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-500'}`}
                            >
                                {r.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold text-slate-800 truncate ${r.done ? 'line-through' : ''}`}>{r.text}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span className="text-xs text-slate-400 font-medium">
                                        {new Date(r.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeReminder(r.id)}
                                className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {reminders.length === 0 && !isLoading && (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                <Bell className="w-6 h-6 text-slate-200" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Reminders</p>
                            <p className="text-xs text-slate-400 mt-1">Add a task to stay organized!</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="p-10 text-center animate-pulse">
                            <p className="text-sm text-slate-400">Loading your reminders...</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <AlertCircle className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <p className="text-indigo-800 text-sm font-bold">Study Recommendation</p>
                    <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                        {reminders.length > 0
                            ? "You have active tasks! Consider using the focus timer for your next session."
                            : "New here? Start by adding your course deadlines or school projects above."}
                    </p>
                </div>
            </div>
        </div>
    );
}
