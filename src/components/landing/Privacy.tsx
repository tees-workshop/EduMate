"use client";

import { Shield, Lock, Eye } from "lucide-react";
import { useFadeUp } from "@/hooks/useFadeUp";

const privacyItems = [
    {
        icon: Lock,
        title: "End-to-End Encryption",
        description: "All your study materials and personal data are encrypted at rest and in transit using AES-256.",
    },
    {
        icon: Eye,
        title: "No Data Selling",
        description: "We never sell, share, or monetize your personal data. Your information is yours, full stop.",
    },
];



export default function Privacy() {
    const { ref: leftRef, style: leftStyle } = useFadeUp(0);
    const { ref: rightRef, style: rightStyle } = useFadeUp(200);

    return (
        <section id="privacy" className="py-20 lg:py-28 relative theme-text">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left */}
                    <div ref={leftRef} style={leftStyle}>
                        <div className="inline-flex items-center gap-2 rounded-full px-4py-1.5 mb-6 border"
                           style={{
                                background: "rgba(5,150,105,0.08)",
                                borderColor: "rgba(5,150,105,0.2)"
                            }}>
                            <Shield className="w-3.5 h-3.5" style={{ color: "#059669" }} />
                            <span className="text-xs font-bold tracking-widest uppercase"
                                style={{ color: "#059669" }}>
                                Privacy First
                            </span>
                        </div>

                       <h2 className="text-3xl sm:text-4xl font-black theme-text mb-4 tracking-tight">
                            Your Privacy is{" "}
                            <span style={{
                                background: "linear-gradient(135deg, #22d3ee, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                Non-Negotiable
                            </span>
                        </h2>
                        <p className="text-lg leading-relaxed mb-8 theme-text-muted">
                            We built EduMate with privacy at its core, not as an afterthought. Your academic data
                            belongs to you, we just help you use it smarter.
                        </p>
                    </div>

                    {/* Right */}
                    <div ref={rightRef} style={rightStyle} className="grid sm:grid-cols-2 gap-4">
                        {privacyItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="rounded-2xl p-5 border transition-all duration-300 theme-card theme-border"
                                    style={{
                                        boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(5,150,105,0.3)";
                                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                       style={{
                                            background: "rgba(5,150,105,0.12)",
                                            border: "1px solid rgba(5,150,105,0.25)"
                                        }}>
                                        <Icon className="w-5 h-5" style={{ color: "#059669" }} />
                                    </div>
                                    <h4 className="font-bold theme-text text-sm mb-2">{item.title}</h4>
                                    <p className="text-xs leading-relaxed theme-text-muted">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
