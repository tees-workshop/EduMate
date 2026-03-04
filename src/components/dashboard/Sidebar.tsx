"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen, LayoutDashboard, Brain, Wrench, HelpCircle,
    Lock, BarChart3, Settings, ChevronLeft, ChevronRight,
    LogOut, User, Library, PenTool
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

const navSections = [
    {
        label: "Main",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
            { icon: Library, label: "Library & Tools", href: "/library" },
            { icon: Brain, label: "Readiness Check", href: "/dashboard/readiness" },
            { icon: HelpCircle, label: "AI Quizzes", href: "/dashboard/quizzes" },
        ],
    },
    {
        label: "Productivity",
        items: [
            { icon: PenTool, label: "Smart Notepad", href: "/library?tab=notepad" },
            { icon: Wrench, label: "Study Tools", href: "/library" },
        ],
    },
    {
        label: "Account",
        items: [
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, loading } = useUser();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <>
            <aside
                className={`fixed top-0 left-0 h-screen bg-slate-900 flex flex-col z-40 transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-64"
                    }`}
            >
                <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-800 ${collapsed ? "justify-center" : ""}`}>
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="text-lg font-black text-white">
                                Edu<span className="gradient-text">Mate</span>
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto scrollbar-thin py-6 px-3">
                    {navSections.map((section) => (
                        <div key={section.label} className="mb-8">
                            {!collapsed && (
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 mb-4 opacity-50">
                                    {section.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all group ${isActive
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
                                            {!collapsed && (
                                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    {!collapsed && user && (
                        <div className="bg-slate-800/50 p-4 rounded-3xl mb-4 border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-xs font-black text-white shrink-0">
                                    {getInitials(user.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-white truncate">{user.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold truncate">Student ({user.level})</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("study_ai_user_id");
                                    window.location.href = "/login";
                                }}
                                className="w-full py-2 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-3 h-3" /> Log Out
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center py-2.5 rounded-2xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition-all border border-indigo-500/20"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            <div className={`shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`} />
        </>
    );
}
