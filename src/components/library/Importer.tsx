"use client";

import { useState, useEffect, useRef } from "react";
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            loadMaterials();
        }
    }, [user]);

    const loadMaterials = async () => {
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
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !user) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // Convert to base64
                const data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = () => reject(new Error('Failed to read file'));
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
                alert(`Could not process ${file.name}. Make sure it's a valid file.`);
            }
        }

        // Call once after all files are processed
        loadMaterials();

        // Reset input so same file can be re-uploaded
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeMaterial = async (id: string) => {
        await db.deleteMaterial(id);
        loadMaterials();
    };

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Hidden File Input */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Upload Box */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-300 group cursor-pointer"
            >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-indigo-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Upload Academic Materials</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                    Drag & drop your notes, PDFs, or past questions here to power your AI study insights.
                </p>
                <button className="mt-6 gradient-bg text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Browse Files
                </button>
            </div>

            {/* Materials List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Uploaded Materials
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Filter materials..."
                            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32 md:w-48"
                        />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {filteredMaterials.map((m) => (
                        <div key={m.id} className="px-6 py-4 flex items-center gap-4 group hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                <File className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{m.name}</p>
                                <p className="text-xs text-slate-400">{m.type.split('/').pop()?.toUpperCase()} • {m.size} • {new Date(m.timestamp).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-2.5 h-2.5" /> AI Indexed
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onSelectMaterial(m)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        title="View Material"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeMaterial(m.id); }}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete Material"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {materials.length === 0 && !isLoading && (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                <File className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Locker is empty</p>
                            <p className="text-xs text-slate-400 mt-1">Upload your first document to get started!</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="p-10 text-center animate-pulse">
                            <p className="text-sm text-slate-400">Loading your materials...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}