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

    const tabs = [
        { id: "materials", label: "Locker", fullLabel: "Academic Locker", icon: Book },
        { id: "notepad", label: "Notepad", fullLabel: "Smart Notepad", icon: PenTool },
        { id: "reminders", label: "Reminders", fullLabel: "Reminders", icon: Bell },
    ];

    return (
        <div className="flex min-h-screen relative" style={{ background: "#080d14" }}>
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{ background: "#22d3ee", filter: "blur(140px)", opacity: 0.08, top: "-100px", left: "-100px", animation: "driftA1 8s ease-in-out infinite" }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{ background: "#059669", filter: "blur(130px)", opacity: 0.07, bottom: "-80px", right: "-80px", animation: "driftA2 10s ease-in-out infinite" }} />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{ background: "#818cf8", filter: "blur(120px)", opacity: 0.06, top: "40%", left: "50%", transform: "translate(-50%, -50%)", animation: "driftA3 12s ease-in-out infinite" }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 p-3 md:p-6 overflow-auto pt-16 md:pt-6">

                        {/* Tabs — scrollable on mobile */}
                        <div className="flex gap-1.5 mb-5 p-1 rounded-2xl border overflow-x-auto scrollbar-none"
                            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex-1"
                                        style={isActive ? {
                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                            color: "#080d14",
                                            boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                        } : { color: "#64748b" }}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="hidden sm:inline">{tab.fullLabel}</span>
                                        <span className="sm:hidden">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Main content — stacks on mobile */}
                        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-5">
                            <div>
                                {activeTab === "materials" && (
                                    <Importer
                                        onSelectMaterial={(m) => setSelectedMaterial(m)}
                                        onMaterialsLoaded={(count) => setMaterialCount(count)}
                                    />
                                )}
                                {activeTab === "notepad" && <Notepad />}
                                {activeTab === "reminders" && <Reminders />}
                            </div>

                            {/* Right sidebar — shows below on mobile */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                                <div className="rounded-2xl p-4 border flex-1 lg:flex-none"
                                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4" style={{ color: "#22d3ee" }} />
                                        Storage Insights
                                    </h3>
                                    <div className="rounded-xl p-4 border"
                                        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.06)" }}>
                                        <p className="text-xs mb-1" style={{ color: "#64748b" }}>Total Materials</p>
                                        <p className="text-2xl font-black text-white">{materialCount} Files</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl p-4 border flex-1 lg:flex-none"
                                    style={{ background: "rgba(34,211,238,0.05)", borderColor: "rgba(34,211,238,0.15)" }}>
                                    <p className="text-sm font-bold text-white mb-2">💡 AI Tip</p>
                                    <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                                        Upload your syllabus to allow the AI to cross-reference your notes with exam requirements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
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