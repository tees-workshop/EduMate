"use client";

import Link from "next/link";
import { TrendingUp, CheckCircle, Clock } from "lucide-react";
import { useReadinessScore } from "@/hooks/useReadinessScore";

export default function StatsRow() {
    const { score, label } = useReadinessScore();

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
            href: "/library",
        },
        {
            icon: Clock,
            label: "Upcoming Deadlines",
            value: "0",
            sub: "No urgent milestones",
            color: "#818cf8",
            glow: "rgba(129,140,248,0.15)",
            border: "rgba(129,140,248,0.2)",
            href: "/library",
        },
    ];

    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <Link
                        key={i}
                        href={stat.href}
                        className="rounded-2xl p-5 border transition-all duration-300 block"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            borderColor: "rgba(255,255,255,0.07)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = stat.border;
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
                            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
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
                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg"
                                style={{
                                    background: stat.glow,
                                    color: stat.color,
                                    border: `1px solid ${stat.border}`
                                }}>
                                Live
                            </span>
                        </div>
                        <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
                        <p className="text-xs font-semibold text-white mb-0.5">{stat.label}</p>
                        <p className="text-xs" style={{ color: "#64748b" }}>{stat.sub}</p>
                    </Link>
                );
            })}
        </div>
    );
}