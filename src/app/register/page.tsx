"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
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

const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)"
};

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [level, setLevel] = useState("400L");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const allUsers = await db.getAllUsers();
            if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                setError("This email is already registered."); setIsLoading(false); return;
            }
            if (allUsers.some(u => u.name.toLowerCase() === name.toLowerCase())) {
                setError("This name is already taken."); setIsLoading(false); return;
            }
            if (allUsers.some(u => u.password === password)) {
                setError("This password is already in use. Please choose a different one."); setIsLoading(false); return;
            }
            const userId = email.toLowerCase().replace(/[^a-z0-9]/g, "");
            await db.saveUser({ id: userId, name, email, password, level, avatar: "" });
            localStorage.setItem("study_ai_user_id", userId);
            router.push("/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden theme-bg theme-text">
            <AuroraBackground />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
                    Create account
                </h2>
                <p className="mt-2 text-center text-sm theme-text-muted">
                    Start your smarter study journey today
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

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <input type="text" required value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text theme-input placeholder-slate-600 focus:outline-none transition-all"
                                    style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                                    placeholder="e.g. Chioma Obi" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <input type="email" required value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text theme-input placeholder-slate-600 focus:outline-none transition-all"
                                    style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                                    placeholder="name@university.edu" />
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Academic Level</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <select value={level} onChange={(e) => setLevel(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text focus:outline-none transition-all appearance-none"
                                    style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                                    {["100L", "200L", "300L", "400L", "500L", "Postgrad"].map(l => (
                                        <option key={l} value={l} style={{ background: "#0f172a" }}>
                                            {l === "Postgrad" ? "Postgraduate" : `${l} Level`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold theme-text mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#475569" }} />
                                <input type="password" required value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 rounded-2xl theme-text theme-input placeholder-slate-600 focus:outline-none transition-all"
                                    style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                                    placeholder="••••••••" />
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                            style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                color: "#080d14",
                                boxShadow: "0 8px 32px rgba(34,211,238,0.25)"
                            }}>
                            {isLoading ? "Creating Account..." : "Create Free Account"}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <p className="text-sm" style={{ color: "#64748b" }}>
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold" style={{ color: "#22d3ee" }}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#334155" }}>
                        <Sparkles className="w-3 h-3" />
                        <span>Smart Personalization</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#334155" }}>
                        <Lock className="w-3 h-3" />
                        <span>Local Secure Data</span>
                    </div>
                </div>
            </div>
        </div>
    );
}