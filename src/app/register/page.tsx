"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, Mail, Lock, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { db } from "@/lib/db";

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
            // Fetch all users to check for uniqueness
            const allUsers = await db.getAllUsers();

            // Check for unique email (case-insensitive)
            if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                setError("This email is already registered. Please use another.");
                setIsLoading(false);
                return;
            }

            // Check for unique name (case-insensitive)
            if (allUsers.some(u => u.name.toLowerCase() === name.toLowerCase())) {
                setError("This name is already taken. Please choose a unique name to avoid system confusion.");
                setIsLoading(false);
                return;
            }

            // Check for unique password (as requested)
            if (allUsers.some(u => u.password === password)) {
                setError("This password has already been used by another student. Please choose a different one.");
                setIsLoading(false);
                return;
            }

            // Create a unique ID from email
            const userId = email.toLowerCase().replace(/[^a-z0-9]/g, "");

            // Save to IndexedDB
            await db.saveUser({
                id: userId,
                name: name,
                email: email,
                password: password,
                level: level,
                avatar: "",
            });

            // Store in localStorage for session handling
            localStorage.setItem("study_ai_user_id", userId);

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error) {
            console.error("Registration failed", error);
            setError("Something went wrong during registration. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex items-center justify-center gap-2 mb-6 group">
                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black text-slate-900">
                        Study<span className="gradient-text">AI</span>
                    </span>
                </Link>
                <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
                    Create account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-500">
                    Join thousands of students studying smarter
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-8 px-4 shadow-2xl shadow-indigo-500/10 sm:rounded-3xl sm:px-10 border border-slate-100">
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-red-600 rotate-45" />
                            </div>
                            <p className="text-sm font-semibold text-red-600 leading-tight">{error}</p>
                        </div>
                    )}
                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="e.g. Chioma Obi"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="name@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Academic Level</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white appearance-none"
                                >
                                    <option value="100L">100 Level</option>
                                    <option value="200L">200 Level</option>
                                    <option value="300L">300 Level</option>
                                    <option value="400L">400 Level</option>
                                    <option value="500L">500 Level</option>
                                    <option value="Postgrad">Postgraduate</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded-lg"
                                />
                            </div>
                            <label htmlFor="terms" className="ml-2 block text-xs text-slate-500 leading-relaxed">
                                I agree to the <a href="#" className="font-semibold text-indigo-600">Terms of Service</a> and <a href="#" className="font-semibold text-indigo-600">Privacy Policy</a>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-bold text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Creating Account..." : "Create Free Account"}
                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-slate-100 pt-6 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Smart Personalization</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Local Secure Data</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
