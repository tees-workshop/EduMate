"use client";

import { useEffect, useRef, useState } from "react";
import {
    Brain, Wrench, Lock, BarChart3, FileQuestion,
    Calendar, Target, Zap, BookOpen
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Readiness Prediction",
        description: "Our ML model analyzes your study patterns and quiz performance to give you a precise readiness score before any exam.",
        color: "#22d3ee",
        badge: "Core Feature",
    },
    {
        icon: Wrench,
        title: "Productivity Tools",
        description: "Built-in Pomodoro timer, task tracker, and focus modes to keep you in the zone every study session.",
        color: "#059669",
        badge: "Core Feature",
    },
    {
        icon: Lock,
        title: "Digital Locker",
        description: "Securely store, organize, and access all your notes, past papers, and study materials all on your device.",
        color: "#818cf8",
        badge: "Core Feature",
    },
    // {
    //     icon: BarChart3,
    //     title: "Smart Analytics",
    //     description: "Deep visual insights into your study patterns, strengths, and weak areas for data-driven decisions.",
    //     color: "#22d3ee",
    //     badge: "Analytics",
    // },
    {
        icon: FileQuestion,
        title: "AI Quiz Generator",
        description: "Upload your notes and EduMate instantly generates custom quizzes tailored to your actual material.",
        color: "#059669",
        badge: "AI Powered",
    },
    // {
    //     icon: Calendar,
    //     title: "Smart Study Planner",
    //     description: "AI-driven timetables that adapt to your deadlines, pace, and performance — so you never fall behind.",
    //     color: "#818cf8",
    //     badge: "AI Powered",
    // },
    // {
    //     icon: Target,
    //     title: "Goal Tracker",
    //     description: "Set academic goals, break them into milestones, and stay motivated with visual progress tracking.",
    //     color: "#22d3ee",
    //     badge: "Productivity",
    // },
    {
        icon: Zap,
        title: "Focus Mode",
        description: "Distraction-free study environment with ambient soundscapes and real-time focus score monitoring.",
        color: "#059669",
        badge: "Productivity",
    },
];

function FeatureCard({ feature, index, className = "" }: { feature: typeof features[0]; index: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const Icon = feature.icon;

    return (
        <div
            ref={ref}
            className={`rounded-2xl p-6 border transition-all duration-700 cursor-default theme-card theme-border h-full ${className}`}
            style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transitionDelay: `${index * 80}ms`,
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${feature.color}40`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                        background: `${feature.color}18`,
                        border: `1px solid ${feature.color}30`
                    }}>
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
                    style={{
                        background: `${feature.color}12`,
                        color: feature.color,
                        border: `1px solid ${feature.color}25`
                    }}>
                    {feature.badge}
                </span>
            </div>
            <h3 className="text-base font-bold theme-text mb-2">{feature.title}</h3>
            <p className="text-sm leading-relaxed theme-text-muted">{feature.description}</p>
        </div>
    );
}

export default function Features() {
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
            { threshold: 0.1 }
        );
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="features" className="py-20 lg:py-28 relative theme-text">

            {/* Background blobs */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div
                    ref={headerRef}
                    className="text-center mb-16 transition-all duration-700"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(24px)"
                    }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border"
                        style={{
                            background: "rgba(34,211,238,0.08)",
                            borderColor: "rgba(34,211,238,0.2)"
                        }}>
                        <BookOpen className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} />
                        <span className="text-xs font-bold tracking-widest uppercase"
                            style={{ color: "#22d3ee" }}>
                            Everything You Need
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black theme-text mb-4 tracking-tight">
                        Powerful Features for{" "}
                        <span style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Serious Students
                        </span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto theme-text-muted">
                        From AI-powered readiness checks to secure file storage — EduMate has every tool you need to excel academically.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                    {features.map((feature, i) => {
                        const smSpan = i === 4 ? "sm:col-span-2" : "sm:col-span-1";
                        const lgSpan = i < 3 ? "lg:col-span-2" : "lg:col-span-3";
                        const className = `${smSpan} ${lgSpan}`;
                        return (
                            <FeatureCard key={feature.title} feature={feature} index={i} className={className} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}