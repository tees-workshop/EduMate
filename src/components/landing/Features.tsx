"use client";

import { useEffect, useRef, useState } from "react";
import {
    Brain, Wrench, Lock, BarChart3, FileQuestion,
    Calendar, Target, Zap, Shield, BookOpen
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Readiness Prediction",
        description:
            "Our AI analyzes your study patterns, quiz performance, and topic mastery to give you a precise readiness score before any exam.",
        color: "from-indigo-500 to-indigo-600",
        bg: "bg-indigo-50",
        badge: "Core Feature",
    },
    {
        icon: Wrench,
        title: "Productivity Tools",
        description:
            "Built-in Pomodoro timer, task tracker, and focus modes to keep you in the zone and make every study session count.",
        color: "from-cyan-500 to-cyan-600",
        bg: "bg-cyan-50",
        badge: "Core Feature",
    },
    {
        icon: Lock,
        title: "Digital Locker",
        description:
            "Securely store, organize, and access all your notes, past papers, and study materials — end-to-end encrypted and always available.",
        color: "from-purple-500 to-purple-600",
        bg: "bg-purple-50",
        badge: "Core Feature",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        description:
            "Deep visual insights into your study patterns, strengths, and weak areas so you can make data-driven study decisions.",
        color: "from-green-500 to-green-600",
        bg: "bg-green-50",
        badge: "Analytics",
    },
    {
        icon: FileQuestion,
        title: "AI Quiz Generator",
        description:
            "Upload your notes and StudyAI instantly generates custom quizzes, flashcards, and practice questions tailored to your material.",
        color: "from-amber-500 to-amber-600",
        bg: "bg-amber-50",
        badge: "AI Powered",
    },
    {
        icon: Calendar,
        title: "Smart Study Planner",
        description:
            "AI-driven personalized timetables that adapt to your deadlines, pace, and performance — so you never fall behind.",
        color: "from-rose-500 to-rose-600",
        bg: "bg-rose-50",
        badge: "AI Powered",
    },
    {
        icon: Target,
        title: "Goal Tracker",
        description:
            "Set academic goals, break them into milestones, and celebrate achievements. Stay motivated with visual progress tracking.",
        color: "from-sky-500 to-sky-600",
        bg: "bg-sky-50",
        badge: "Productivity",
    },
    {
        icon: Zap,
        title: "Focus Mode",
        description:
            "Distraction-free study environment with ambient soundscapes, website blocking, and real-time focus score monitoring.",
        color: "from-violet-500 to-violet-600",
        bg: "bg-violet-50",
        badge: "Productivity",
    },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
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
            className={`bg-white rounded-2xl p-6 border border-slate-100 card-hover shadow-sm transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${feature.bg} text-slate-600`}>
                    {feature.badge}
                </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
        </div>
    );
}

export default function Features() {
    return (
        <section id="features" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 mb-4">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-indigo-700 text-xs font-semibold tracking-wide uppercase">Everything You Need</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                        Powerful Features for <span className="gradient-text">Serious Students</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        From AI-powered readiness checks to secure file storage — StudyAI has every tool you need to excel academically.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
