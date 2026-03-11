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
        <div className="flex min-h-screen relative" style={{ background: "#080d14" }}>

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "#22d3ee", filter: "blur(140px)", opacity: 0.08,
                        top: "-100px", left: "-100px",
                        animation: "driftA1 8s ease-in-out infinite, pulseBlob1 4s ease-in-out infinite"
                    }} />
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "#059669", filter: "blur(130px)", opacity: 0.07,
                        bottom: "-80px", right: "-80px",
                        animation: "driftA2 10s ease-in-out infinite, pulseBlob2 5s ease-in-out infinite"
                    }} />
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        background: "#818cf8", filter: "blur(120px)", opacity: 0.06,
                        top: "40%", left: "50%", transform: "translate(-50%, -50%)",
                        animation: "driftA3 12s ease-in-out infinite, pulseBlob3 6s ease-in-out infinite"
                    }} />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Library & Productivity Tools" />

                    <main className="flex-1 p-4 md:p-6 overflow-auto pt-16 md:pt-6">

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 p-1 rounded-2xl w-fit border"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                borderColor: "rgba(255,255,255,0.07)"
                            }}>
                            {[
                                { id: "materials", label: "Academic Locker", icon: Book },
                                { id: "notepad", label: "Smart Notepad", icon: PenTool },
                                { id: "reminders", label: "Reminders", icon: Bell },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                                        style={isActive ? {
                                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                                            color: "#080d14",
                                            boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                                        } : {
                                            color: "#64748b"
                                        }}
                                        onMouseEnter={e => {
                                            if (!isActive) (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                                        }}
                                        onMouseLeave={e => {
                                            if (!isActive) (e.currentTarget as HTMLElement).style.color = "#64748b";
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
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

                            {/* Right sidebar */}
                            <div className="space-y-4">
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.07)"
                                    }}>
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4" style={{ color: "#22d3ee" }} />
                                        Storage Insights
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="rounded-xl p-4 border"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                borderColor: "rgba(255,255,255,0.06)"
                                            }}>
                                            <p className="text-xs mb-1" style={{ color: "#64748b" }}>Total Materials</p>
                                            <p className="text-2xl font-black text-white">{materialCount} Files</p>
                                        </div>
                                        <div className="rounded-xl p-4 border"
                                            style={{
                                                background: "rgba(255,255,255,0.03)",
                                                borderColor: "rgba(255,255,255,0.06)"
                                            }}>
                                            <p className="text-xs mb-2" style={{ color: "#64748b" }}>Storage Used</p>
                                            <div className="flex justify-between text-xs font-bold text-white mb-2">
                                                <span>0 MB</span>
                                                <span style={{ color: "#22d3ee" }}>0%</span>
                                            </div>
                                            <div className="h-1.5 rounded-full overflow-hidden"
                                                style={{ background: "rgba(255,255,255,0.06)" }}>
                                                <div className="h-full rounded-full w-[15%]"
                                                    style={{ background: "linear-gradient(90deg, #22d3ee, #059669)" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Tip */}
                                <div className="rounded-2xl p-5 border"
                                    style={{
                                        background: "rgba(34,211,238,0.05)",
                                        borderColor: "rgba(34,211,238,0.15)"
                                    }}>
                                    <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        💡 AI Tip
                                    </p>
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