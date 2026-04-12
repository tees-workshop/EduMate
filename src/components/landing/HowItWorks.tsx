"use client"

import { Upload, Cpu, Rocket } from "lucide-react";
import { useFadeUp } from "@/hooks/useFadeUp";

const steps = [
    {
        icon: Upload,
        step: "01",
        title: "Upload Your Materials",
        description:
            "Add your notes, syllabi, and past papers to your Digital Locker so EduMate can index them and build your study foundation.",
        color: "#22d3ee",
    },
    {
        icon: Cpu,
        step: "02",
        title: "Take A Baseline Prediction",
        description:
            "Answer a quick baseline survey on your sleep, exam score, practice paper count, and study hours so EduMate can predict your readiness and guide your next steps.",
        color: "#059669",
    },
    {
        icon: Rocket,
        step: "03",
        title: "Take a Quiz",
        description:
            "Answer an AI-generated quiz tailored to your study level, then review your score and improve your confidence before exam day.",
        color: "#818cf8",
    },
];

function StepCard ({ step, index}: { step: typeof steps[0]; index: number}){
    const { ref, style } = useFadeUp(index * 150);
    const Icon = step.icon;
    
    return (
        <div ref={ref} style={style} className="flex flex-col items-center text-center">
            {/*Icon*/}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center shhadow-xl"
                    style={{
                        background: `${step.color}18`,
                        border: `1px solid ${step.color}14`,
                        boxShadow: `0 8px 32px ${step.color}20`
                    }}>
                        <Icon className="w-9 h-9" style={{ color: step.color }} />
                    </div>

            </div>
            <div className="text-5xl font-black mv-2 opacity-10 tracking-light"
              style={{ color: step.color }}>
                {step.step}
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm leading-relaxed max-w-xs"style={{ color: "#94a3b8" }}>
                {step.description}
              </p>
        </div> 
    );
}

export default function HowItWorks() {
    const { ref: headerRef, style: headerStyle } = useFadeUp(0);
    const { ref: ctaRef, style: ctaStyle } = useFadeUp(0);


    return (
        <section id="how-it-works" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div ref={headerRef} style={headerStyle} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border"
                       style={{
                        background: "rgba(5, 150, 105, 0.08)",
                        borderColor: "rgba(5, 150, 105, 0.2)"
                       }}>
                        <span className="w-2 h-2 rounded-full" style={{background: "#059669" }} />
                        <span className="text-xs font-bold tracking-widest uppercase"
                            style={{color: "#059669"}}>
                                How it works
                            </span>
                       </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-light">
                        Three simple steps to {" "}
                        <span style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>
                            Assessment Confidence
                        </span>
                    </h2>
                    <p className="text-lg max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
                        Three simple steps to transform how you prepare for assessments.
                    </p>
                </div>

                {/*Steps*/}
                <div className="relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden lg:block absolute top-10 left-[20%] right-[20%] h-[1px] opacity-20"
                       style={{ background: "linear-gradient(90deg, #22d3ee, #059669, #818cf8" }} />

                    
                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, i) => (
                            <StepCard key={i} step={step} index={i} />
                        ))}
                    </div>
                    
                </div>

                {/* CTA under steps */}
                <div ref={ctaRef} style={ctaStyle} className="text-center mt-16">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            color: "#080d14",
                            boxShadow: "0 8px 32px rgba(34,211,238,0.25)"
                        }}
                    >
                        Get Started in 30 Seconds →
                    </a>
                </div>
            </div>
        </section>
    );
}
