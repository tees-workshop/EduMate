"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle, Clock, BookOpen, ArrowRight, Plus, X } from "lucide-react";
import { useReadinessScore } from "@/hooks/useReadinessScore";
import { useUser } from "@/hooks/useUser";
import { db, Topic } from "@/lib/db";

export default function StatsRow() {
    const { score, label } = useReadinessScore();
    const { user } = useUser();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopic, setNewTopic] = useState("");

    const loadTopics = async () => {
        if (!user) return;
        const data = await db.getTopicsByUser(user.id);
        setTopics(data.sort((a, b) => b.timestamp - a.timestamp));
    };

    useEffect(() => {
        loadTopics();
    }, [user]);

    const addTopic = async () => {
        if (!newTopic.trim() || !user) return;
        const topic: Topic = {
            id: crypto.randomUUID(),
            userId: user.id,
            name: newTopic.trim(),
            type: "manual",
            timestamp: Date.now()
        };
        await db.saveTopic(topic);
        setNewTopic("");
        loadTopics();
    };

    const deleteTopic = async (id: string) => {
        await db.deleteTopic(id);
        loadTopics();
    };

    const stats = [
        {
            icon: TrendingUp,
            label: "Readiness Score",
            value: score !== null ? `${score}%` : "0%",
            sub: label ? `Prediction: ${label}` : "Take a readiness check",
            color: "#22d3ee",
            glow: "rgba(34,211,238,0.15)",
            border: "rgba(34,211,238,0.2)",
            href: "/dashboard/readiness",
        },
        {
            icon: CheckCircle,
            label: "Tasks Completed",
            value: "0 / 0",
            sub: "No tasks yet",
            color: "#059669",
            glow: "rgba(5,150,105,0.15)",
            border: "rgba(5,150,105,0.2)",
            href: "/library/Reminders",
        },
        // {
        //     icon: Clock,
        //     label: "Upcoming Deadlines",
        //     value: "0",
        //     sub: "No urgent milestones",
        //     color: "#818cf8",
        //     glow: "rgba(129,140,248,0.15)",
        //     border: "rgba(129,140,248,0.2)",
        //     href: "/library",
        // },
    ];

    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <Link
                        key={i}
                        href={stat.href}
                        className="rounded-2xl p-5 border transition-all duration-300 block theme-card"
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = stat.border;
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.1)`;
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: stat.glow,
                                    border: `1px solid ${stat.border}`
                                }}>
                                <Icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            {/* <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                                style={{
                                    background: stat.glow,
                                    color: stat.color,
                                    border: `1px solid ${stat.border}`
                                }}>
                                Live
                            </span> */}
                        </div>
                        <p className="text-2xl font-black theme-text mb-1">{stat.value}</p>
                        <p className="text-xs font-semibold theme-text mb-0.5">{stat.label}</p>
                        <p className="text-xs" style={{ color: "#64748b" }}>{stat.sub}</p>
                    </Link>
                );
            })}
            {/* Topics to Review & Focus CTA as the 3rd slot */}
            <div className="flex flex-col gap-4">
                <div className="rounded-2xl p-5 border flex-1 theme-card theme-border transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2"
                             style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.2)" }}>
                             <BookOpen className="w-5 h-5" style={{ color: "#22d3ee" }} />
                        </div>
                        <h4 className="text-xs font-bold theme-text">Topics to Review</h4>
                    </div>
                    <div className="flex-1 flex flex-col min-h-[80px]">
                        {topics.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-4 text-center h-full flex flex-col justify-center"
                                style={{ borderColor: "var(--border)" }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 theme-text-muted">
                                    No Data Yet
                                </p>
                                <p className="text-[10px] theme-text-muted">
                                    Add a manual topic to review today.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 mb-3 max-h-24 overflow-y-auto custom-scrollbar">
                                {topics.map(t => (
                                    <button key={t.id} onClick={() => deleteTopic(t.id)}
                                        className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border"
                                        style={{
                                            background: t.type === "ai" ? "rgba(34,211,238,0.1)" : "var(--bg-card)",
                                            borderColor: t.type === "ai" ? "rgba(34,211,238,0.2)" : "var(--border)",
                                            color: t.type === "ai" ? "#22d3ee" : "var(--text)"
                                        }}
                                        title="Click to mark as mastered">
                                        {t.name}
                                        <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newTopic}
                                    onChange={e => setNewTopic(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addTopic()}
                                    placeholder="Add manual topic..."
                                    className="flex-1 bg-transparent border-none text-[10px] focus:outline-none theme-text"
                                />
                                <button onClick={addTopic} className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110 shrink-0"
                                    style={{ background: "rgba(34,211,238,0.15)", color: "#22d3ee" }}>
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href="/dashboard/focus" className="rounded-2xl p-4 text-sm font-bold flex items-center justify-between transition-all hover:scale-[1.02]"
                    style={{
                        background: "linear-gradient(135deg, #22d3ee, #059669)",
                        color: "#080d14",
                        boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                    }}>
                    <span>Start Today&apos;s Focus Session</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}