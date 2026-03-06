"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Privacy", href: "#privacy" },
];

function EduMateLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
            </defs>
            <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="url(#grad1)" strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(15 18 18)" fill="url(#grad1)" opacity="0.15" />
            <path d="M18 10L24 18L18 26L12 18Z" fill="url(#grad2)" opacity="0.9" />
            <circle cx="18" cy="18" r="3" fill="url(#grad1)" />
            <circle cx="18" cy="5" r="1.5" fill="#22d3ee" opacity="0.8" />
            <circle cx="30" cy="12" r="1.5" fill="#059669" opacity="0.8" />
            <circle cx="30" cy="24" r="1.5" fill="#818cf8" opacity="0.8" />
        </svg>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#080d14]/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg shadow-black/20"
                    : "bg-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div
                                className="absolute inset-0 blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                                style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", borderRadius: "10px" }}
                            />
                            <div className="relative">
                                <EduMateLogo />
                            </div>
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">
                            Edu<span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>Mate</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-slate-400 hover:text-white text-sm font-semibold transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#080d14] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
                            style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}
                        >
                            <Sparkles className="w-4 h-4" />
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-slate-400 hover:text-white text-sm font-semibold transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <Link
                                    href="/login"
                                    className="flex-1 text-center py-2.5 rounded-xl border border-white/10 text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-[#080d14]"
                                    style={{ background: "linear-gradient(135deg, #22d3ee, #059669)" }}
                                >
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