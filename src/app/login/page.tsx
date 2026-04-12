"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/db";

function AuroraBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute w-[500px] h-[500px] rounded-full"
                style={{
                    background: "#22d3ee", filter: "blur(120px)", opacity: 0.12,
                    top: "-100px", left: "-100px",
                    animation: "driftA1 8s ease-in-out infinite, pulseBlob1 4s ease-in-out infinite"
                }} />
            <div className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                    background: "#059669", filter: "blur(100px)", opacity: 0.1,
                    bottom: "-80px", right: "-80px",
                    animation: "driftA2 10s ease-in-out infinite, pulseBlob2 5s ease-in-out infinite"
                }} />
            <div className="absolute w-[350px] h-[350px] rounded-full"
                style={{
                    background: "#818cf8", filter: "blur(100px)", opacity: 0.08,
                    top: "40%", left: "40%",
                    animation: "driftA3 12s ease-in-out infinite, pulseBlob3 6s ease-in-out infinite"
                }} />
            <div className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }} />
        </div>
    );
}

function EduMateLogo() {
    return (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="loginGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="loginGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
            </defs>
            <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="url(#loginGrad1)" strokeWidth="1.5" fill="none" opacity="0.6" />
            <rect x="11" y="11" width="14" height="14" rx="3" transform="rotate(15 18 18)" fill="url(#loginGrad1)" opacity="0.15" />
            <path d="M18 10L24 18L18 26L12 18Z" fill="url(#loginGrad2)" opacity="0.9" />
            <circle cx="18" cy="18" r="3" fill="url(#loginGrad1)" />
            <circle cx="18" cy="5" r="1.5" fill="#22d3ee" opacity="0.8" />
            <circle cx="30" cy="12" r="1.5" fill="#059669" opacity="0.8" />
            <circle cx="30" cy="24" r="1.5" fill="#818cf8" opacity="0.8" />
        </svg>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const userId = email.toLowerCase().replace(/[^a-z0-9]/g, "");
            const user = await db.getUser(userId);
            if (!user) { setError("Account not found. Please register first."); setIsLoading(false); return; }
            if (user.password !== password) { setError("Incorrect password. Please try again."); setIsLoading(false); return; }
            localStorage.setItem("study_ai_user_id", userId);
            router.push("/dashboard");
        } catch (error) {
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden theme-bg theme-text">
            <AuroraBackground />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
                    <div className="relative">
                        <div className="absolute inset-0 blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                            style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", borderRadius: "10px" }} />
                        <div className="relative"><EduMateLogo /></div>
                    </div>
                    <span className="text-2xl font-black theme-text tracking-tight">
                        Edu<span style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Mate</span>
                    </span>
                </Link>

                <h2 className="text-center text-3xl font-black theme-text tracking-tight">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm theme-text-muted">
                    Sign in to continue your study journey
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="py-8 px-4 sm:rounded-3xl sm:px-10 border backdrop-blur-xl theme-card theme-border"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(34,211,238,0.15)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)"
                    }}>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl border flex items-center gap-3"
                            style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
                            <Sparkles className="w-4 h-4 rotate-45 shrink-0" style={{ color: "#ef4444" }} />
                            <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <input
                                    type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text theme-input placeholder-slate-600 focus:outline-none transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)"
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <input
                                    type="password" required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text theme-input placeholder-slate-600 focus:outline-none transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)"
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input id="remember-me" type="checkbox"
                                    className="h-4 w-4 rounded border-slate-600 bg-transparent" />
                                <label htmlFor="remember-me" className="text-xs theme-text-muted">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-xs font-semibold transition-colors"
                                style={{ color: "#22d3ee" }}>
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                color: "#080d14",
                                boxShadow: "0 8px 32px rgba(34,211,238,0.25)"
                            }}
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <p className="text-sm" style={{ color: "#64748b" }}>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold transition-colors"
                                style={{ color: "#22d3ee" }}>
                                Create Free Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer badges */}
                <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs theme-text-muted">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Powered</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs theme-text-muted">
                        <Lock className="w-3 h-3" />
                        <span>IndexedDB Secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}