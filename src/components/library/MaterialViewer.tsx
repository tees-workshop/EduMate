"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, FileText, Sparkles, Loader2, File } from "lucide-react";
import { Material, db } from "@/lib/db";

interface ViewerProps {
    material: Omit<Material, "data">;
    onClose: () => void;
}

export default function MaterialViewer({ material, onClose }: ViewerProps) {
    const [fullMaterial, setFullMaterial] = useState<Material | null>(null);
    const [loadingDoc, setLoadingDoc] = useState(true);
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Lazy load the full material data only when viewer opens
    useEffect(() => {
        setLoadingDoc(true);
        db.getMaterialById(material.id)
            .then(m => setFullMaterial(m ?? null))
            .catch((e: unknown) => console.error(e))
            .finally(() => setLoadingDoc(false));
    }, [material.id]);

    useEffect(() => {
        setMessages([{
            role: "assistant",
            content: `I've indexed **${material.name}**. Ask me anything about it — I can summarize, explain concepts, or quiz you on the content!`
        }]);
    }, [material]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const buildSystemPrompt = () => {
        const isImage = material.type.startsWith("image/");
        return `You are Document Sensei, an AI tutor specialized in helping students understand their study materials.

The student has uploaded a file called "${material.name}" (${material.type}, ${material.size}).
${isImage ? "This is an image file." : "This is a document file."}

Your role:
- Answer questions specifically about this document
- Summarize sections when asked
- Quiz the student on the content
- Explain difficult concepts in simple terms
- Keep responses concise and focused
- Be encouraging and supportive
- If you cannot determine the exact content, use the filename and type as context to give helpful study guidance`;
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
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, something went wrong. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div className="w-full h-full max-w-7xl rounded-3xl overflow-hidden flex flex-col md:flex-row border"
                style={{
                    background: "#080d14",
                    borderColor: "rgba(255,255,255,0.08)",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.6)"
                }}>

                {/* Document Area */}
                <div className="flex-1 flex flex-col min-w-0"
                    style={{ background: "rgba(255,255,255,0.02)" }}>

                    {/* Doc Header */}
                    <div className="px-6 py-4 border-b flex items-center justify-between"
                        style={{
                            borderColor: "rgba(255,255,255,0.07)",
                            background: "rgba(255,255,255,0.03)"
                        }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                <FileText className="w-5 h-5" style={{ color: "#080d14" }} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white truncate max-w-[200px] md:max-w-md">
                                    {material.name}
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#475569" }}>
                                    {material.type.split("/").pop()} • {material.size}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl transition-all border"
                            style={{
                                color: "#475569",
                                borderColor: "rgba(255,255,255,0.07)",
                                background: "rgba(255,255,255,0.03)"
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = "#f87171";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.3)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = "#475569";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                            }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Doc Preview */}
                    <div className="flex-1 overflow-auto p-6 md:p-12">
                        <div className="rounded-2xl border mx-auto max-w-4xl min-h-full p-8 md:p-14 relative"
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                borderColor: "rgba(255,255,255,0.06)"
                            }}>

                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter"
                                style={{
                                    background: "rgba(34,211,238,0.08)",
                                    color: "#22d3ee",
                                    border: "1px solid rgba(34,211,238,0.15)"
                                }}>
                                Preview Mode
                            </div>

                            {/* Loading state */}
                            {loadingDoc && (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#22d3ee" }} />
                                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#475569" }}>
                                        Loading document...
                                    </p>
                                </div>
                            )}

                            {/* Image preview */}
                            {!loadingDoc && fullMaterial?.type.startsWith("image/") && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={fullMaterial.data}
                                    alt={fullMaterial.name}
                                    className="w-full h-auto rounded-xl"
                                />
                            )}

                            {/* PDF preview */}
                            {!loadingDoc && fullMaterial?.type === "application/pdf" && (
                                <iframe
                                    src={fullMaterial.data}
                                    className="w-full rounded-xl border-0"
                                    style={{
                                        minHeight: "600px",
                                        borderColor: "rgba(255,255,255,0.06)"
                                    }}
                                    title={fullMaterial.name}
                                />
                            )}

                            {/* Other file types */}
                            {!loadingDoc && fullMaterial &&
                                !fullMaterial.type.startsWith("image/") &&
                                fullMaterial.type !== "application/pdf" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                                style={{
                                                    background: "rgba(34,211,238,0.08)",
                                                    border: "1px solid rgba(34,211,238,0.15)"
                                                }}>
                                                <File className="w-7 h-7" style={{ color: "#22d3ee" }} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{fullMaterial.name}</p>
                                                <p className="text-xs" style={{ color: "#475569" }}>
                                                    {fullMaterial.type} • {fullMaterial.size}
                                                </p>
                                            </div>
                                        </div>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i}
                                                className="h-3 rounded-full"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    width: `${[100, 85, 92, 78, 95, 70][i]}%`
                                                }} />
                                        ))}
                                        <div className="h-24 rounded-2xl flex items-center justify-center mt-6 border"
                                            style={{
                                                background: "rgba(255,255,255,0.02)",
                                                borderColor: "rgba(255,255,255,0.05)"
                                            }}>
                                            <p className="text-xs italic" style={{ color: "#334155" }}>
                                                Use the AI chat to ask questions about this document →
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {/* Failed to load */}
                            {!loadingDoc && !fullMaterial && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <File className="w-10 h-10" style={{ color: "#334155" }} />
                                    <p className="text-sm font-bold" style={{ color: "#475569" }}>
                                        Could not load document
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Chat Sidebar */}
                <div className="w-full md:w-80 lg:w-96 border-l flex flex-col"
                    style={{
                        borderColor: "rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.02)"
                    }}>

                    {/* Chat Header */}
                    <div className="p-5 border-b"
                        style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                <Sparkles className="w-3.5 h-3.5" style={{ color: "#080d14" }} />
                            </div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">
                                Document Sensei
                            </h4>
                        </div>
                        <p className="text-[10px] leading-relaxed" style={{ color: "#475569" }}>
                            Ask questions about this specific document.
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#059669" }} />
                            <span className="text-[10px] font-bold" style={{ color: "#059669" }}>
                                Online · Llama 3.3 70B
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className="max-w-[88%] px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                                    style={msg.role === "user" ? {
                                        background: "linear-gradient(135deg, #22d3ee, #059669)",
                                        color: "#080d14",
                                        fontWeight: 600,
                                        borderBottomRightRadius: "4px"
                                    } : {
                                        background: "rgba(255,255,255,0.05)",
                                        color: "#94a3b8",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                        borderBottomLeftRadius: "4px"
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2.5 rounded-xl text-xs flex items-center gap-2"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        color: "#64748b",
                                        border: "1px solid rgba(255,255,255,0.07)"
                                    }}>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t"
                        style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        <div className="flex gap-2">
                            <input
                                value={chatMsg}
                                onChange={(e) => setChatMsg(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send()}
                                placeholder="Message your material..."
                                className="flex-1 px-4 py-2.5 rounded-xl text-xs focus:outline-none transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: "#f1f5f9"
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)")}
                                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                            />
                            <button
                                onClick={send}
                                disabled={loading}
                                className="p-2.5 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#080d14"
                                }}
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

