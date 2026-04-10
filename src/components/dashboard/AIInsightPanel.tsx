"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, BookOpen, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useReadinessScore } from "@/hooks/useReadinessScore";
import { db } from "@/lib/db";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const heatmapData = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

function HeatCell({ value }: { value: number }) {
    const opacity = value === 0 ? 0.06 : value === 1 ? 0.2 : value === 2 ? 0.4 : value === 3 ? 0.6 : value === 4 ? 0.8 : 1;
    return (
        <div
            className="w-full aspect-square rounded-sm transition-transform hover:scale-125 cursor-default"
            style={{
                background: value === 0 ? "rgba(255,255,255,0.06)" : `rgba(34,211,238,${opacity})`,
            }}
            title={`${value} sessions`}
        />
    );
}

export default function AIInsightPanel() {
    const { user } = useUser();
    const { score, label } = useReadinessScore();
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [materialNames, setMaterialNames] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Load materials for context
    useEffect(() => {
        if (user?.id) {
            db.getMaterialsByUser(user.id).then(mats => {
                setMaterialNames(mats.map(m => m.name));
            });
        }
    }, [user]);

    // Initial greeting
    useEffect(() => {
        if (user) {
            setMessages([{
                role: "assistant",
                content: `Hi ${user.name.split(" ")[0]}! I'm your AI study assistant. I know your current readiness score is ${score !== null ? `${score}%` : "not yet calculated"}. Ask me anything about your subjects or how to improve!`
            }]);
        }
    }, [user, score]);

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const buildSystemPrompt = () => {
        return `You are a helpful AI study assistant for a student named ${user?.name ?? "Student"}.

Student context:
- Readiness score: ${score !== null ? `${score}% (${label})` : "Not yet assessed"}
- Study materials uploaded: ${materialNames.length > 0 ? materialNames.join(", ") : "None yet"}
- Academic level: ${user?.level ?? "Unknown"}

Your role:
- Help the student understand academic concepts and topics
- Give concise, clear explanations suitable for a student
- Encourage and motivate them based on their readiness score
- Suggest study strategies when relevant
- Keep responses focused and under 150 words unless a detailed explanation is needed
- Be friendly and supportive`;
    };

    const send = async () => {
        if (!chatMsg.trim() || loading) return;
        const userMsg = chatMsg.trim();
        setChatMsg("");

        const newMessages: { role: "user" | "assistant"; content: string }[] = [
            ...messages,
            { role: "user", content: userMsg }
        ];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages,
                    systemPrompt: buildSystemPrompt()
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">


            {/* Topics to Review */}
            <div className="rounded-2xl p-4 border"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)"
                }}>
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                    Topics to Review
                </h4>
                <div className="rounded-xl border border-dashed p-4 text-center"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
                        No Data Yet
                    </p>
                    <p className="text-[10px]" style={{ color: "#475569" }}>
                        Complete a quiz to see topic insights.
                    </p>
                </div>
            </div>

            {/* Heatmap */}
            {/* <div className="rounded-2xl p-4 border"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)"
                }}>
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                    Weekly Activity
                </h4>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map((d, i) => (
                        <div key={i} className="text-center text-[10px] font-medium" style={{ color: "#475569" }}>{d}</div>
                    ))}
                </div>
                <div className="space-y-1">
                    {heatmapData.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-1">
                            {week.map((val, di) => (
                                <HeatCell key={di} value={val} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                    <span className="text-[10px]" style={{ color: "#475569" }}>Less</span>
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                        <div key={v} className="w-3 h-3 rounded-sm"
                            style={{
                                background: v === 0 ? "rgba(255,255,255,0.06)" : `rgba(34,211,238,${v * 0.18})`
                            }} />
                    ))}
                    <span className="text-[10px]" style={{ color: "#475569" }}>More</span>
                </div>
            </div> */}

            {/* CTA */}
            <button
                className="rounded-2xl p-4 text-sm font-bold flex items-center justify-between transition-all hover:scale-[1.02]"
                style={{
                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                    color: "#080d14",
                    boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                }}>
                <span>Start Today&apos;s Focus Session</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}