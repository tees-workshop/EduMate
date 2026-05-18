"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Brain, HelpCircle,
    Settings, ChevronLeft, ChevronRight,
    LogOut, Library, Menu, X, Sparkles, Timer
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
            { icon: Sparkles, label: "AI Assistant", href: "/dashboard/assistant" },
            { icon: Timer, label: "Focus Session", href: "/dashboard/focus" },
        ],
    },
    {
        label: "Account",
        items: [
            { icon: Settings, label: "Settings", href: "/dashboard/settings" },
        ],
    },
];

function EduMateLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(15 18 18)" fill="#059669" opacity="0.15" />
            <path d="M18 10L24 18L18 26L12 18Z" fill="#059669" opacity="0.9" />
            <circle cx="18" cy="18" r="3" fill="#22d3ee" />
            <circle cx="18" cy="5" r="1.5" fill="#22d3ee" opacity="0.8" />
            <circle cx="30" cy="12" r="1.5" fill="#059669" opacity="0.8" />
            <circle cx="30" cy="24" r="1.5" fill="#818cf8" opacity="0.8" />
        </svg>
    );
}

function NavContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { user } = useUser();

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center h-16 px-4 border-b ${collapsed ? "justify-center" : "justify-between"}`}
                style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={onClose}>
                    <EduMateLogo />
                    {!collapsed && (
                        <span className="text-lg font-black text-white tracking-tight">
                            Edu<span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>Mate</span>
                        </span>
                    )}
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#64748b" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#f1f5f9"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748b"}>
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                {navSections.map((section) => (
                    <div key={section.label} className="mb-8">
                        {!collapsed && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] px-3 mb-3"
                                style={{ color: "#64748b" }}>
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
                                        onClick={onClose}
                                        title={collapsed ? item.label : undefined}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
                                        style={{
                                            background: isActive
                                                ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(5,150,105,0.15))"
                                                : "transparent",
                                            border: isActive
                                                ? "1px solid rgba(34,211,238,0.2)"
                                                : "1px solid transparent",
                                        }}
                                        onMouseEnter={e => {
                                            if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                                        }}
                                        onMouseLeave={e => {
                                            if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                                        }}
                                    >
                                        <Icon className="w-4 h-4 shrink-0"
                                            style={{ color: isActive ? "#22d3ee" : "#64748b" }} />
                                        {!collapsed && (
                                            <span className="text-sm font-semibold"
                                                style={{ color: isActive ? "#f1f5f9" : "#64748b" }}>
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User card */}
            <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {!collapsed && user && (
                    <div className="rounded-xl p-3 mb-3 border"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            borderColor: "rgba(255,255,255,0.08)"
                        }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#080d14"
                                }}>
                                {getInitials(user.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                <p className="text-[10px] font-medium truncate" style={{ color: "#64748b" }}>
                                    Student · {user.level}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("study_ai_user_id");
                                window.location.href = "/login";
                            }}
                            className="w-full py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 transition-all border"
                            style={{
                                background: "rgba(239,68,68,0.08)",
                                borderColor: "rgba(239,68,68,0.15)",
                                color: "#f87171"
                            }}
                        >
                            <LogOut className="w-3 h-3" /> Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarStyle = {
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--border)"
    };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl border"
                style={{
                    background: "rgba(8,13,20,0.9)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#94a3b8"
                }}
                onClick={() => setMobileOpen(true)}
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-screen w-72 z-50 border-r transition-transform duration-300 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={sidebarStyle}
            >
                <NavContent collapsed={false} onClose={() => setMobileOpen(false)} />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden md:flex fixed top-0 left-0 h-screen flex-col z-40 border-r transition-all duration-300 ${
                    collapsed ? "w-16" : "w-64"
                }`}
                style={sidebarStyle}
            >
                <NavContent collapsed={collapsed} />

                {/* Collapse toggle */}
                <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center py-2 rounded-xl transition-all border"
                        style={{
                            background: "rgba(34,211,238,0.06)",
                            borderColor: "rgba(34,211,238,0.15)",
                            color: "#22d3ee"
                        }}
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>
            </aside>

            {/* Desktop spacer */}
            <div className={`hidden md:block shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`} />
        </>
    );
}