"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useFadeUp } from "@/hooks/useFadeUp";
import { startDemoSession } from "@/lib/demo";

export default function CTABanner() {
    const { ref, style } = useFadeUp(0);
    const [demoLoading, setDemoLoading] = useState(false);
    const router = useRouter();

    const handleDemo = async (e: React.MouseEvent) => {
        e.preventDefault();
        setDemoLoading(true);
        await startDemoSession();
        router.push("/dashboard");
    };

    return (
        <section className="py-20 lg:py-28 theme-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={ref}
                    style={{
                        ...style,
                        background: "linear-gradient(135deg, rgba(34,211,238,0.12), rgba(5,150,105,0.12))",
                        borderColor: "rgba(34,211,238,0.2)",
                        boxShadow: "0 8px 64px rgba(34,211,238,0.1), inset 0 1px 0 rgba(255,255,255,0.06)"
                    }}
                    className="relative overflow-hidden border rounded-3xl px-8 py-16 md:px-16 text-center backdrop-blur-xl theme-card theme-border"
                >
                    {/* Decorative orbs */}
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                        style={{ background: "#22d3ee", opacity: 0.15 }} />
                    <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
                        style={{ background: "#818cf8", opacity: 0.15 }} />

                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border"
                            style={{
                                background: "rgba(34,211,238,0.1)",
                                borderColor: "rgba(34,211,238,0.25)"
                            }}>
                            <Sparkles className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                            <span className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: "#22d3ee" }}>
                                Start Now!
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black theme-text mb-4 leading-tight tracking-tight">
                            Ready to Ace{" "}
                            <span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                Your Next Exam?
                            </span>
                        </h2>

                        <p className="text-lg max-w-2xl mx-auto mb-10 theme-text-muted">
                            Use EduMate to study smarter, predict your readiness, and walk into every exam with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                                style={{
                                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                                    color: "#080d14",
                                    boxShadow: "0 8px 32px rgba(34,211,238,0.25)"
                                }}
                            >
                                Create Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            {/* <button
                                onClick={handleDemo}
                                disabled={demoLoading}
                                className="flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-base transition-all border theme-card theme-border theme-text disabled:opacity-50"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    borderColor: "rgba(255,255,255,0.1)",
                                }}
                            >
                                {demoLoading ? "Preparing Demo..." : "View Dashboard Demo"}
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
