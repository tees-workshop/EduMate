"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
    { value: 12000, suffix: "+", label: "Students Helped", prefix: "" },
    { value: 94, suffix: "%", label: "Readiness Accuracy", prefix: "" },
    { value: 3.2, suffix: "M", label: "Study Hours Saved", prefix: "" },
    { value: 98, suffix: "%", label: "Satisfaction Rate", prefix: "" },
];

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const duration = 2000;
                    const steps = 60;
                    const stepTime = duration / steps;
                    let step = 0;
                    const timer = setInterval(() => {
                        step++;
                        const progress = step / steps;
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(parseFloat((eased * target).toFixed(1)));
                        if (step >= steps) clearInterval(timer);
                    }, stepTime);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {prefix}
            {target < 10 ? count.toFixed(1) : Math.round(count).toLocaleString()}
            {suffix}
        </span>
    );
}

export default function StatsBar() {
    return (
        <section className="py-16 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="gradient-bg rounded-3xl p-8 md:p-12 shadow-2xl shadow-indigo-500/20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-white mb-2">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                                </p>
                                <p className="text-indigo-100 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
