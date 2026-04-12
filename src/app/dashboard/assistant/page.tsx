"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Sparkles, Loader2, Send, Trash2, BookOpen, Brain, FileQuestion, Lightbulb } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useReadinessScore } from "@/hooks/useReadinessScore";
import { db } from "@/lib/db";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const SUGGESTED_PROMPTS = [
    { icon: Brain, label: "Explain a concept", prompt: "Can you explain the concept of neural networks in simple terms?" },
    { icon: BookOpen, label: "Summarize a topic", prompt: "Give me a brief summary of how photosynthesis works." },
    { icon: FileQuestion, label: "Quiz me", prompt: "Quiz me with 5 questions on any topic from my uploaded materials." },
    { icon: Lightbulb, label: "Study tips", prompt: "What are the best study strategies for someone with a low readiness score?" },
];

export default function AssistantPage() {
    const { user } = useUser();
    const { score, label } = useReadinessScore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [materialNames, setMaterialNames] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.id) {
            db.getMaterialsByUser(user.id).then(mats => {
                setMaterialNames(mats.map(m => m.name));
            });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setMessages([{
                role: "assistant",
                content: `Hi ${user.name.split(" ")[0]}! 👋 I'm your personal AI study assistant powered by Llama 3.3 70B.\n\nI know your current readiness score is **${score !== null ? `${score}% (${label})` : "not yet calculated"}** and you have **${materialNames.length} material(s)** uploaded.\n\nAsk me anything — I can explain concepts, quiz you, summarize topics, or help you study smarter!`,
                timestamp: new Date()
            }]);
        }
    }, [user, score, materialNames]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const buildSystemPrompt = () => `You are an expert AI study assistant for a student named ${user?.name ?? "Student"}.

Student context:
- Academic level: ${user?.level ?? "Unknown"}
- Readiness score: ${score !== null ? `${score}% (${label})` : "Not yet assessed"}
- Uploaded materials: ${materialNames.length > 0 ? materialNames.join(", ") : "None yet"}

Your role:
- Help the student understand academic concepts clearly
- Provide concise, well-structured explanations
- Quiz the student when asked
- Suggest study strategies based on their readiness score
- Be encouraging, friendly and motivating
- Use bullet points and structure when explaining complex topics
- Keep responses focused and under 200 words unless a detailed explanation is needed`;

    const send = async (overrideInput?: string) => {
        const text = (overrideInput ?? input).trim();
        if (!text || loading) return;
        setInput("");

        const newMessages: Message[] = [
            ...messages,
            { role: "user", content: text, timestamp: new Date() }
        ];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({ role: m.role, content: m.content })),
                    systemPrompt: buildSystemPrompt()
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.reply,
                timestamp: new Date()
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const clearChat = () => {
        if (!user) return;
        setMessages([{
            role: "assistant",
            content: `Chat cleared! How can I help you study today, ${user.name.split(" ")[0]}?`,
            timestamp: new Date()
        }]);
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="flex min-h-screen relative theme-bg theme-text">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "#22d3ee", filter: "blur(140px)", opacity: 0.07,
                        top: "-100px", left: "-100px",
                        animation: "driftA1 8s ease-in-out infinite"
                    }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "#818cf8", filter: "blur(130px)", opacity: 0.06,
                        bottom: "-80px", right: "-80px",
                        animation: "driftA2 10s ease-in-out infinite"
                    }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="AI Study Assistant" />

                    <main className="flex-1 flex flex-col p-4 md:p-6 pt-16 md:pt-6 overflow-hidden">
                        <div className="flex-1 flex flex-col lg:flex-row gap-5 max-w-6xl mx-auto w-full">

                            {/* Left — Chat */}
                            <div className="flex-1 flex flex-col rounded-2xl border overflow-hidden"
                                style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)",
                                        boxShadow: "0 4px 40px rgba(0,0,0,0.2)",
                                        minHeight: "calc(100vh - 160px)"
                                }}>
                                   
                                {/* Chat Header */}
                                <div className="px-5 py-4 border-b flex items-center justify-between"
                                    style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                            <Sparkles className="w-4 h-4" style={{ color: "#080d14" }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">AI Study Assistant</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#059669" }} />
                                                <span className="text-[10px] font-bold" style={{ color: "#059669" }}>
                                                    Online · Llama 3.3 70B
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearChat}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                                        style={{
                                            background: "rgba(248,113,113,0.06)",
                                            borderColor: "rgba(248,113,113,0.15)",
                                            color: "#f87171"
                                        }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.12)"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.06)"}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Clear
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                                            {msg.role === "assistant" && (
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1"
                                                    style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                                    <Sparkles className="w-3.5 h-3.5" style={{ color: "#080d14" }} />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1 max-w-[75%]">
                                                <div
                                                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                                                    style={msg.role === "user" ? {
                                                        background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                        color: "#080d14",
                                                        fontWeight: 600,
                                                        borderBottomRightRadius: "4px"
                                                    } : {
                                                        background: "rgba(255,255,255,0.05)",
                                                        color: "#cbd5e1",
                                                        border: "1px solid rgba(255,255,255,0.07)",
                                                        borderBottomLeftRadius: "4px"
                                                    }}
                                                >
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] px-1"
                                                    style={{ color: "#334155", textAlign: msg.role === "user" ? "right" : "left" }}>
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                            {msg.role === "user" && (
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1 text-xs font-black"
                                                    style={{
                                                        background: "rgba(255,255,255,0.08)",
                                                        color: "#f1f5f9"
                                                    }}>
                                                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="flex justify-start gap-3">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                                <Sparkles className="w-3.5 h-3.5" style={{ color: "#080d14" }} />
                                            </div>
                                            <div className="px-4 py-3 rounded-2xl flex items-center gap-2 text-sm"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid rgba(255,255,255,0.07)",
                                                    color: "#64748b",
                                                    borderBottomLeftRadius: "4px"
                                                }}>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Input */}
                                <div className="px-5 py-4 border-t"
                                    style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                                    <div className="flex gap-3">
                                        <input
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                                            placeholder="Ask anything about your studies..."
                                            className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "#f1f5f9"
                                            }}
                                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)")}
                                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                                        />
                                        <button
                                            onClick={() => send()}
                                            disabled={loading || !input.trim()}
                                            className="px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                                            style={{
                                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                                color: "#080d14",
                                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                            }}>
                                            <Send className="w-4 h-4" />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Context Panel */}
                            <div className="lg:w-72 flex flex-col gap-4 shrink-0">

                                {/* Student context */}
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-4"
                                        style={{ color: "#475569" }}>
                                        Your Context
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs" style={{ color: "#64748b" }}>Readiness</span>
                                            <span className="text-xs font-black"
                                                style={{
                                                    color: (score ?? 0) >= 70 ? "#059669" : (score ?? 0) >= 50 ? "#f97316" : "#f87171"
                                                }}>
                                                {score !== null ? `${score}%` : "N/A"}
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full overflow-hidden"
                                            style={{ background: "rgba(255,255,255,0.06)" }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${score ?? 0}%`,
                                                    background: (score ?? 0) >= 70
                                                        ? "linear-gradient(90deg, #059669, #22d3ee)"
                                                        : (score ?? 0) >= 50
                                                            ? "linear-gradient(90deg, #f97316, #fbbf24)"
                                                            : "linear-gradient(90deg, #f87171, #f97316)"
                                                }} />
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs" style={{ color: "#64748b" }}>Materials</span>
                                            <span className="text-xs font-black text-white">{materialNames.length} files</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs" style={{ color: "#64748b" }}>Level</span>
                                            <span className="text-xs font-black text-white">{user?.level ?? "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Suggested prompts */}
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-4"
                                        style={{ color: "#475569" }}>
                                        Suggested Prompts
                                    </p>
                                    <div className="space-y-2">
                                        {SUGGESTED_PROMPTS.map((p, i) => {
                                            const Icon = p.icon;
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => send(p.prompt)}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold border transition-all"
                                                    style={{
                                                        background: "rgba(255,255,255,0.02)",
                                                        borderColor: "rgba(255,255,255,0.06)",
                                                        color: "#94a3b8"
                                                    }}
                                                    onMouseEnter={e => {
                                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.2)";
                                                        (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                                                        (e.currentTarget as HTMLElement).style.background = "rgba(34,211,238,0.05)";
                                                    }}
                                                    onMouseLeave={e => {
                                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                                        (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                                                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                                                    }}
                                                >
                                                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#22d3ee" }} />
                                                    {p.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Materials list */}
                                {materialNames.length > 0 && (
                                    <div className="rounded-2xl p-5 border"
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            borderColor: "rgba(255,255,255,0.07)"
                                        }}>
                                        <p className="text-[10px] font-black uppercase tracking-widest mb-3"
                                            style={{ color: "#475569" }}>
                                            Uploaded Materials
                                        </p>
                                        <div className="space-y-2">
                                            {materialNames.slice(0, 5).map((name, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full shrink-0"
                                                        style={{ background: "#22d3ee" }} />
                                                    <span className="text-xs truncate" style={{ color: "#64748b" }}>
                                                        {name}
                                                    </span>
                                                </div>
                                            ))}
                                            {materialNames.length > 5 && (
                                                <p className="text-[10px]" style={{ color: "#334155" }}>
                                                    +{materialNames.length - 5} more
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}