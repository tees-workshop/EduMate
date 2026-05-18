"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, File, Trash2, FileText, CheckCircle, Search, Plus, Eye } from "lucide-react";
import { db, Material } from "@/lib/db";
import { useUser } from "@/hooks/useUser";

interface ImporterProps {
    onSelectMaterial: (material: Material) => void;
    onMaterialsLoaded: (count: number) => void;
}

export default function Importer({ onSelectMaterial, onMaterialsLoaded }: ImporterProps) {
    const { user } = useUser();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadMaterials = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await db.getMaterialsByUser(user.id);
            const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
            setMaterials(sorted);
            onMaterialsLoaded(sorted.length);
        } catch (error) {
            console.error("Failed to load materials", error);
        } finally {
            setIsLoading(false);
        }
    }, [user, onMaterialsLoaded]);

    useEffect(() => {
        if (user) loadMaterials();
    }, [user, loadMaterials]);

    const handleFileUpload = async (files: FileList) => {
        if (!files || !user) return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = () => reject(new Error("Failed to read file"));
                    reader.readAsDataURL(file);
                });
                const material: Material = {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    name: file.name,
                    type: file.type || "Unknown",
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB",
                    data,
                    timestamp: Date.now(),
                };
                await db.saveMaterial(material);
            } catch (error) {
                console.error(`Failed to process ${file.name}:`, error);
                alert(`Could not process ${file.name}.`);
            }
        }
        loadMaterials();
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeMaterial = async (id: string) => {
        await db.deleteMaterial(id);
        loadMaterials();
    };

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase())
    );

    const getFileIcon = (type: string) => {
        if (type.includes("pdf")) return <FileText className="w-5 h-5" style={{ color: "#f87171" }} />;
        if (type.includes("image")) return <FileText className="w-5 h-5" style={{ color: "#818cf8" }} />;
        return <File className="w-5 h-5" style={{ color: "#94a3b8" }} />;
    };

    return (
        <div className="space-y-5">
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
            />

            {/* Upload Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
                }}
                className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
                style={{
                    borderColor: dragOver ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.08)",
                    background: dragOver ? "rgba(34,211,238,0.05)" : "rgba(255,255,255,0.02)",
                }}
            >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform"
                    style={{
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.2)",
                        transform: dragOver ? "scale(1.1)" : "scale(1)"
                    }}>
                    <Upload className="w-8 h-8" style={{ color: "#22d3ee" }} />
                </div>
                <h3 className="text-lg font-bold text-white">Upload Academic Materials</h3>
                <p className="text-sm mt-1 max-w-xs" style={{ color: "#64748b" }}>
                    Drag & drop your notes, PDFs, or past questions here to power your AI study insights.
                </p>
                <button
                    className="mt-6 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105"
                    style={{
                        background: "linear-gradient(135deg, #22d3ee, #059669)",
                        color: "#080d14",
                        boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                    }}>
                    <Plus className="w-4 h-4" /> Browse Files
                </button>
            </div>

            {/* Materials List */}
            <div className="rounded-2xl border overflow-hidden"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)"
                }}>
                <div className="px-5 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: "#22d3ee" }} />
                        Uploads
                        {materials.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                    background: "rgba(34,211,238,0.1)",
                                    color: "#22d3ee",
                                    border: "1px solid rgba(34,211,238,0.2)"
                                }}>
                                {materials.length}
                            </span>
                        )}
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                            style={{ color: "#475569" }} />
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Filter materials..."
                            className="pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all w-32 md:w-44"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#f1f5f9"
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(34,211,238,0.3)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                        />
                    </div>
                </div>

                <div>
                    {filteredMaterials.map((m) => (
                        <div key={m.id}
                            className="px-5 py-4 flex items-center gap-4 group transition-all border-b"
                            style={{
                                borderColor: "rgba(255,255,255,0.04)"
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)"
                                }}>
                                {getFileIcon(m.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{m.name}</p>
                                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                                    {m.type.split("/").pop()?.toUpperCase()} • {m.size} • {new Date(m.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                                    style={{
                                        background: "rgba(5,150,105,0.1)",
                                        color: "#059669",
                                        border: "1px solid rgba(5,150,105,0.2)"
                                    }}>
                                    <CheckCircle className="w-2.5 h-2.5" /> Indexed
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onSelectMaterial(m)}
                                        className="p-2 rounded-lg transition-all"
                                        style={{ color: "#475569" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#22d3ee"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
                                        title="View Material"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeMaterial(m.id); }}
                                        className="p-2 rounded-lg transition-all"
                                        style={{ color: "#475569" }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f87171"}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#475569"}
                                        title="Delete Material"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {materials.length === 0 && !isLoading && (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed"
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    borderColor: "rgba(255,255,255,0.08)"
                                }}>
                                <File className="w-8 h-8" style={{ color: "#1e293b" }} />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: "#334155" }}>
                                Locker is empty
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#334155" }}>
                                Upload your first document to get started!
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="p-10 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#22d3ee", animationDelay: "0ms" }} />
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#22d3ee", animationDelay: "150ms" }} />
                                <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#22d3ee", animationDelay: "300ms" }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}