"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Privacy", href: "#privacy" },
    { label: "Testimonials", href: "#testimonials" },
];

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "glass shadow-lg shadow-indigo-500/5 py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">
                            Edu<span className="gradient-text">Mate</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="nav-link text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            Get Started Free
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 animate-fade-in">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-slate-600 hover:text-indigo-600 text-sm font-medium"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link
                                href="/register"
                                className="gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold text-center shadow-md"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
