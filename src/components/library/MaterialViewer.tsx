"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, Send, Highlighter, FileText, Sparkles, StickyNote } from "lucide-react";
import { Material } from "@/lib/db";

interface ViewerProps {
    material: Material;
    onClose: () => void;
}

export default function MaterialViewer({ material, onClose }: ViewerProps) {
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState([
        { from: "ai", text: `I've indexed ${material.name}. Ask me anything about it!` }
    ]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatMsg.trim()) return;

        const userMsg = chatMsg.trim();
        setMessages(prev => [...prev, { from: "user", text: userMsg }]);
        setChatMsg("");

        // Mock AI Response logic
        setTimeout(() => {
            setMessages(prev => [...prev, {
                from: "ai",
                text: `Based on the content of ${material.name}, that's a great question! However, since I'm in demo mode, I can't generate a real summary yet. Once connected to a live model, I'll provide specific answers from your notes.`
            }]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full h-full max-w-7xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">

                {/* Main Content Area (Document) */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
                    <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 truncate max-w-[200px] md:max-w-md">{material.name}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{material.type.split('/').pop()} • {material.size}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-xs font-bold bg-white border border-slate-100 rounded-xl px-3 group">
                                <Highlighter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Highlight</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-xs font-bold bg-white border border-slate-100 rounded-xl px-3 group">
                                <StickyNote className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="hidden sm:inline">Add Note</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-100 rounded-xl"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4 md:p-12">
                        {/* Mock Document Rendering */}
                        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-16 min-h-full mx-auto max-w-4xl border border-slate-100 relative group">
                            <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                Preview Mode
                            </div>

                            {material.type.startsWith('image/') ? (
                                <img src={material.data} alt={material.name} className="w-full h-auto rounded-lg shadow-sm" />
                            ) : (
                                <div className="space-y-6">
                                    <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
                                    <div className="h-32 bg-slate-50 rounded-2xl w-full border border-slate-100 flex items-center justify-center">
                                        <p className="text-slate-400 text-xs font-medium italic">Document content visualization goes here...</p>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                                    <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Chat Sidebar */}
                <div className="w-full md:w-80 lg:w-96 border-l border-slate-100 flex flex-col bg-white">
                    <div className="p-6 border-b border-slate-50">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Document Sensei</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Ask questions about this specific document.</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.from === 'user'
                                        ? 'gradient-bg text-white rounded-tr-none'
                                        : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                value={chatMsg}
                                onChange={(e) => setChatMsg(e.target.value)}
                                placeholder="Message your material..."
                                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 gradient-bg text-white rounded-xl shadow-md hover:scale-105 transition-transform"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
