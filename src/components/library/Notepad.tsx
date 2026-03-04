"use client";

import { useState, useEffect } from "react";
import { PenTool, Save, RotateCcw, Highlighter, Type, Bold, Italic, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";
import { useUser } from "@/hooks/useUser";

export default function Notepad() {
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Untitled Note");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Note: I will implement the save logic once I add the 'saveNote' method to StudyDB in the next step.
    // For now, this is a polished UI version that mirrors the functional components.

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note Title..."
                        className="text-lg font-black text-slate-800 bg-transparent border-none focus:outline-none w-full"
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Bold className="w-4 h-4 text-slate-600" /></button>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Italic className="w-4 h-4 text-slate-600" /></button>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-indigo-200 bg-white"><Highlighter className="w-4 h-4 text-indigo-500" /></button>
                    <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><Type className="w-4 h-4 text-slate-600" /></button>
                </div>
                <div className="flex items-center gap-2">
                    {lastSaved && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" /> Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    <button className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

            {/* Editor Space */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 p-8 overflow-y-auto">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start typing your intelligent notes here... Highlight important parts for AI summary."
                        className="w-full h-full resize-none text-slate-700 leading-relaxed bg-transparent border-none focus:outline-none font-medium text-base"
                    />
                </div>

                {/* Helper Badge */}
                <div className="absolute right-8 bottom-8">
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                        <PenTool className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Smart Mode Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
