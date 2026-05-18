"use client";

import { BookOpen, ArrowRight } from "lucide-react";

export default function AIInsightPanel() {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Topics to Review */}
            <div className="rounded-2xl p-4 border"
                style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)"
                }}>
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                    Topics to Review
                </h4>
                <div className="rounded-xl border border-dashed p-4 text-center"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
                        No Data Yet
                    </p>
                    <p className="text-[10px]" style={{ color: "#475569" }}>
                        Complete a quiz to see topic insights.
                    </p>
                </div>
            </div>

            {/* CTA */}
            <button
                className="rounded-2xl p-4 text-sm font-bold flex items-center justify-between transition-all hover:scale-[1.02]"
                style={{
                    background: "linear-gradient(135deg, #22d3ee, #059669)",
                    color: "#080d14",
                    boxShadow: "0 4px 20px rgba(34,211,238,0.2)"
                }}>
                <span>Start Today&apos;s Focus Session</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}