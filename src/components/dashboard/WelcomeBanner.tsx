"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useReadinessScore } from "@/hooks/useReadinessScore";

export default function WelcomeBanner() {
    const [greeting, setGreeting] = useState("Good morning");
    const { user } = useUser();
    const { score } = useReadinessScore();

    useEffect(() => {
        const hour = new Date().getHours();
        let activeGreeting = "Good evening";
        if (hour < 12) activeGreeting = "Good morning";
        else if (hour < 18) activeGreeting = "Good afternoon";

        const timer = setTimeout(() => {
            setGreeting(activeGreeting);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 mb-6 border"
            style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
                boxShadow: "0 4px 40px rgba(0,0,0,0.2)"
            }}>

            {/* Subtle inner glow */}
            <div className="absolute top-0 left-0 w-[300px] h-[200px] rounded-full pointer-events-none"
                style={{
                    background: "#22d3ee",
                    filter: "blur(80px)",
                    opacity: 0.05,
                }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest"
                        style={{ color: "#22d3ee" }}>
                        <Sparkles className="w-3.5 h-3.5" />
                        Study Personalized
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                        {greeting},{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            {user ? user.name.split(" ")[0] : "Student"}
                        </span>! 👋
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                        Your readiness is at{" "}
                        <span className="text-white font-semibold">
                            {score !== null ? `${score}%` : "0%"}
                        </span>.{" "}
                        {score === null
                            ? "Start your first session and power up!"
                            : score >= 70
                                ? "Great job, keep it up!"
                                : "Keep studying, you're getting there!"}
                    </p>
                </div>
            </div>
        </div>
    );
}