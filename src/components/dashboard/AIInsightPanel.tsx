"use client";

import { useState, useEffect } from "react";
import { Sparkles, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const insights: { topic: string; score: number; action: string }[] = [];

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
// Empty heatmap for new users
const heatmapData = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];

function HeatCell({ value }: { value: number }) {
    const intensity = {
        0: "bg-slate-100",
        1: "bg-indigo-100",
        2: "bg-indigo-200",
        3: "bg-indigo-300",
        4: "bg-indigo-400",
        5: "bg-indigo-500",
    }[value] ?? "bg-slate-100";

    return (
        <div
            className={`w-full aspect-square rounded-sm ${intensity} transition-transform hover:scale-125`}
            title={`${value} sessions`}
        />
    );
}

export default function AIInsightPanel() {
    const { user } = useUser();
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);

    useEffect(() => {
        if (user) {
            setMessages([
                { from: "ai", text: `Hi ${user.name.split(" ")[0]}! I'm your study assistant. Once you upload your first few materials to the library, I can start helping you with quizzes and readiness predictions!` }
            ]);
        }
    }, [user]);

    const send = () => {
        if (!chatMsg.trim()) return;
        const userMsg = chatMsg.trim();
        setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
        setChatMsg("");
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    from: "ai",
                    text: "I'm still learning! Once you add study materials, I'll be able to help you better.",
                },
            ]);
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* AI Chat Panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col" style={{ minHeight: "220px" }}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                    <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">AI Study Assistant</p>
                        <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Online
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-thin">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.from === "user"
                                    ? "gradient-bg text-white rounded-br-sm"
                                    : "bg-slate-50 text-slate-700 rounded-bl-sm border border-slate-100"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-3 py-3 border-t border-slate-100 flex gap-2">
                    <input
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && send()}
                        placeholder="Ask your AI tutor..."
                        className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-300 bg-slate-50"
                    />
                    <button
                        onClick={send}
                        className="gradient-bg text-white px-3 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Recommended Topics */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Topics to Review
                </h4>
                <div className="space-y-2.5">
                    {insights.map((item, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-700">{item.topic}</span>
                                <span className={`text-xs font-bold ${item.score < 70 ? "text-amber-500" : "text-green-500"}`}>
                                    {item.score}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.score < 70 ? "bg-amber-400" : "bg-green-500"}`}
                                    style={{ width: `${item.score}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-400">→ {item.action}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Heatmap */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                    Weekly Activity
                </h4>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdays.map((d, i) => (
                        <div key={i} className="text-center text-xs text-slate-400 font-medium">{d}</div>
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
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-400">Less</span>
                    {[0, 1, 2, 3, 4, 5].map((v) => (
                        <HeatCell key={v} value={v} />
                    ))}
                    <span className="text-xs text-slate-400">More</span>
                </div>
            </div>

            {/* Next Action CTA */}
            <button className="gradient-bg text-white rounded-2xl p-4 text-sm font-semibold flex items-center justify-between hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
                <span>Start Today&apos;s Focus Session</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
