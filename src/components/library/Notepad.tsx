"use client";

import { useState, useEffect } from "react";
import { PenTool, Save, Trash2, Plus, CheckCircle, FileText, ChevronLeft } from "lucide-react";
import { db, Note } from "@/lib/db";
import { useUser } from "@/hooks/useUser";

export default function Notepad() {
    const { user } = useUser();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => {
        if (user) loadNotes();
    }, [user]);

    const loadNotes = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await db.getNotesByUser(user.id);
            const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
            setNotes(sorted);
            if (sorted.length > 0 && !activeNote) setActiveNote(sorted[0]);
        } catch (e) {
            console.error("Failed to load notes", e);
        } finally {
            setIsLoading(false);
        }
    };

    const createNote = async () => {
        if (!user) return;
        const note: Note = {
            id: crypto.randomUUID(),
            userId: user.id,
            title: "Untitled Note",
            content: "",
            timestamp: Date.now(),
        };
        await db.saveNote(note);
        await loadNotes();
        setActiveNote(note);
        setShowEditor(true);
    };

    const saveNote = async () => {
        if (!activeNote) return;
        setIsSaving(true);
        try {
            await db.saveNote({ ...activeNote, timestamp: Date.now() });
            setSavedAt(new Date());
            await loadNotes();
        } catch (e) {
            console.error("Failed to save note", e);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteNote = async (id: string) => {
        await db.deleteNote(id);
        if (activeNote?.id === id) {
            setActiveNote(null);
            setShowEditor(false);
        }
        await loadNotes();
    };

    const selectNote = (note: Note) => {
        setActiveNote(note);
        setShowEditor(true);
    };

    return (
        <div className="rounded-2xl border overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
                minHeight: "500px"
            }}>
            <div className="flex h-full" style={{ minHeight: "500px" }}>

                {/* Notes Sidebar — hidden on mobile when editor is open */}
                <div className={`${showEditor ? "hidden md:flex" : "flex"} w-full md:w-56 shrink-0 border-r flex-col`}
                    style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                    <div className="px-4 py-4 border-b flex items-center justify-between"
                        style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                            My Notes
                        </span>
                        <button onClick={createNote}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", color: "#080d14" }}
                            title="New Note">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-4 flex justify-center">
                                <div className="flex gap-1">
                                    {[0, 150, 300].map(delay => (
                                        <div key={delay} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                            style={{ background: "#22d3ee", animationDelay: `${delay}ms` }} />
                                    ))}
                                </div>
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#334155" }}>No notes yet</p>
                                <p className="text-[10px] mt-1" style={{ color: "#334155" }}>Click + to create one</p>
                            </div>
                        ) : (
                            notes.map(note => (
                                <div key={note.id}
                                    onClick={() => selectNote(note)}
                                    className="px-4 py-3 cursor-pointer group flex items-start justify-between gap-2 border-b transition-all"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.04)",
                                        background: activeNote?.id === note.id ? "rgba(34,211,238,0.07)" : "transparent",
                                        borderLeft: activeNote?.id === note.id ? "2px solid #22d3ee" : "2px solid transparent"
                                    }}>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold truncate"
                                            style={{ color: activeNote?.id === note.id ? "#22d3ee" : "#f1f5f9" }}>
                                            {note.title || "Untitled Note"}
                                        </p>
                                        <p className="text-[10px] mt-0.5 truncate" style={{ color: "#475569" }}>
                                            {note.content ? note.content.slice(0, 30) + "..." : "Empty note"}
                                        </p>
                                        <p className="text-[10px] mt-1" style={{ color: "#334155" }}>
                                            {new Date(note.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                        className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        style={{ color: "#475569" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}>
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Editor — full screen on mobile */}
                <div className={`${showEditor ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}>
                    {activeNote ? (
                        <>
                            <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3"
                                style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                                {/* Back button on mobile */}
                                <button
                                    onClick={() => setShowEditor(false)}
                                    className="md:hidden p-1.5 rounded-lg border mr-1"
                                    style={{ borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <input
                                    value={activeNote.title}
                                    onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                                    placeholder="Note title..."
                                    className="flex-1 text-base md:text-lg font-black bg-transparent border-none focus:outline-none min-w-0"
                                    style={{ color: "#f1f5f9" }}
                                />
                                <div className="flex items-center gap-2 shrink-0">
                                    {savedAt && !isSaving && (
                                        <span className="text-[10px] font-bold uppercase flex items-center gap-1 hidden sm:flex"
                                            style={{ color: "#059669" }}>
                                            <CheckCircle className="w-3 h-3" />
                                            Saved
                                        </span>
                                    )}
                                    <button onClick={saveNote} disabled={isSaving}
                                        className="px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                                        style={{
                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                            color: "#080d14",
                                            boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                        }}>
                                        <Save className="w-3.5 h-3.5" />
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 md:p-8">
                                <textarea
                                    value={activeNote.content}
                                    onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                                    placeholder="Start typing your notes here..."
                                    className="w-full h-full resize-none bg-transparent border-none focus:outline-none leading-relaxed text-sm md:text-base"
                                    style={{ color: "#f1f5f9", minHeight: "350px" }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
                                <PenTool className="w-7 h-7" style={{ color: "#22d3ee" }} />
                            </div>
                            <p className="text-sm font-bold text-white mb-2">No Note Selected</p>
                            <p className="text-xs mb-5" style={{ color: "#475569" }}>
                                Select a note or create a new one.
                            </p>
                            <button onClick={createNote}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", color: "#080d14" }}>
                                <Plus className="w-4 h-4" /> New Note
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}