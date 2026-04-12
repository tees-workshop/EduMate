"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
    { label: "Features",    href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Privacy",     href: "#privacy" },
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

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === "light";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // nav background:
    // - desktop: transparent until scroll
    // - mobile: always solid (so links are visible on the hero)
    const navBg = isLight
        ? scrolled || mobileOpen
            ? "rgba(240,244,248,0.95)"
            : "rgba(240,244,248,0.92)"  // always visible on light mode
        : scrolled || mobileOpen
            ? "rgba(8,13,20,0.92)"
            : "rgba(8,13,20,0.85)";     // always solid on mobile dark too

    const textColor    = isLight ? "#0f172a" : "#f1f5f9";
    const mutedColor   = isLight ? "#475569" : "#94a3b8";
    const borderColor  = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)";

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: navBg,
                backdropFilter: "blur(20px)",
                borderBottom: scrolled ? `1px solid ${borderColor}` : "1px solid transparent",
                padding: scrolled ? "12px 0" : "20px 0",
                boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.1)" : "none",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", borderRadius: "10px" }} />
                            <div className="relative"><EduMateLogo /></div>
                        </div>
                        <span className="text-xl font-black tracking-tight" style={{ color: textColor }}>
                            Edu<span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>Mate</span>
                        </span>
                    </Link>

                    {/* Desktop Nav links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a key={link.label} href={link.href}
                                className="text-sm font-semibold transition-colors duration-200 hover:text-white"
                                style={{ color: mutedColor }}>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA + theme toggle */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-110"
                            style={{
                                background: isLight ? "rgba(8,145,178,0.08)" : "rgba(255,255,255,0.05)",
                                borderColor: isLight ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.08)",
                                color: isLight ? "#0891b2" : "#94a3b8",
                            }}
                            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
                        >
                            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        <Link href="/login"
                            className="text-sm font-semibold transition-colors"
                            style={{ color: mutedColor }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = textColor}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = mutedColor}
                        >
                            Sign In
                        </Link>
                        <Link href="/register"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:scale-105 transition-all"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                boxShadow: "0 4px 16px rgba(34,211,238,0.2)"
                            }}>
                            <Sparkles className="w-4 h-4" />
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile right: theme + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
                            style={{
                                background: isLight ? "rgba(8,145,178,0.08)" : "rgba(255,255,255,0.06)",
                                borderColor: isLight ? "rgba(8,145,178,0.2)" : "rgba(255,255,255,0.1)",
                                color: isLight ? "#0891b2" : "#94a3b8",
                            }}
                        >
                            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>
                        <button
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: mutedColor }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden mt-4 pb-4 pt-4 border-t" style={{ borderColor }}>
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a key={link.label} href={link.href}
                                    className="text-sm font-semibold transition-colors"
                                    style={{ color: mutedColor }}
                                    onClick={() => setMobileOpen(false)}>
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <Link href="/login"
                                    className="flex-1 text-center py-2.5 rounded-xl border text-sm font-bold transition-colors"
                                    style={{
                                        borderColor,
                                        color: mutedColor,
                                        background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"
                                    }}>
                                    Sign In
                                </Link>
                                <Link href="/register"
                                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                                    style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}>
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}