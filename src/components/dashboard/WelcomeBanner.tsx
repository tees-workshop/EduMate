"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function WelcomeBanner() {
    const [greeting, setGreeting] = useState("Good morning");
    const { user } = useUser();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <div className="relative overflow-hidden bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-indigo-500/5 mb-8">
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-60" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-60" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-widest mb-2">
                        <Sparkles className="w-4 h-4" />
                        Study Personalized
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                        {greeting}, <span className="gradient-text">{user ? user.name.split(" ")[0] : "Student"}</span>! 👋
                    </h2>
                    <p className="text-sm text-slate-500 max-w-xl font-medium">
                        You&apos;re currently on a **0-day streak**. Your readiness for your goals is at **0%**. Time to start your first session and power up!
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 min-w-[240px]">
                    <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Milestone</p>
                        <p className="text-sm font-black text-slate-800">DS Mock Quiz</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Tomorrow, 10:00 AM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
