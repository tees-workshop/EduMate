"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Importer from "@/components/library/Importer";
import Notepad from "@/components/library/Notepad";
import Reminders from "@/components/library/Reminders";
import { Book, PenTool, Bell, Shield } from "lucide-react";
import MaterialViewer from "@/components/library/MaterialViewer";
import { Material } from "@/lib/db";

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState("materials");
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [materialCount, setMaterialCount] = useState(0);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header title="Library & Productivity Tools" />

                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {/* Top Tabs */}
                    <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl w-fit shadow-sm border border-slate-100">
                        {[
                            { id: "materials", label: "Academic Locker", icon: Book },
                            { id: "notepad", label: "Smart Notepad", icon: PenTool },
                            { id: "reminders", label: "Reminders", icon: Bell },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                        ? "gradient-bg text-white shadow-md shadow-indigo-500/20"
                                        : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                        <div className="min-h-[600px]">
                            {activeTab === "materials" && (
                                <Importer
                                    onSelectMaterial={(m) => setSelectedMaterial(m)}
                                    onMaterialsLoaded={(count) => setMaterialCount(count)}
                                />
                            )}
                            {activeTab === "notepad" && <Notepad />}
                            {activeTab === "reminders" && <Reminders />}
                        </div>

                        {/* Sidebar for the page */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-indigo-500" />
                                    Storage Insights
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-500 mb-1">Total Materials</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {materialCount} Files
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-500 mb-1">Memory Used</p>
                                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                            <span>42.5 MB</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full gradient-bg w-[15%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                                <p className="text-indigo-800 text-sm font-bold mb-2">AI Tip 💡</p>
                                <p className="text-indigo-600 text-xs leading-relaxed">
                                    Upload your syllabus to allow the AI to cross-reference your notes with exam requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {selectedMaterial && (
                <MaterialViewer
                    material={selectedMaterial}
                    onClose={() => setSelectedMaterial(null)}
                />
            )}
        </div>
    );
}