import { Upload, Cpu, Rocket } from "lucide-react";

const steps = [
    {
        icon: Upload,
        step: "01",
        title: "Upload Your Materials",
        description:
            "Add your notes, syllabi, and past papers to your Digital Locker. StudyAI securely indexes everything to power your insights.",
        color: "from-indigo-500 to-indigo-600",
    },
    {
        icon: Cpu,
        step: "02",
        title: "AI Analyzes & Plans",
        description:
            "Our AI assesses your knowledge gaps, builds a personalized study schedule, and generates practice quizzes aligned to your exams.",
        color: "from-cyan-500 to-cyan-600",
    },
    {
        icon: Rocket,
        step: "03",
        title: "Study Smart & Succeed",
        description:
            "Follow your AI-crafted plan, track your readiness score climbing, and walk into every exam with full confidence.",
        color: "from-purple-500 to-purple-600",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 lg:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                        How <span className="gradient-text">EduMate</span> Works
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        Three simple steps to transform how you prepare for assessments.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden lg:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-cyan-200 to-purple-200 z-0" />

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="flex flex-col items-center text-center">
                                    {/* Icon circle */}
                                    <div className="relative mb-6">
                                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl animate-pulse-glow`}>
                                            <Icon className="w-9 h-9 text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-bg border-4 border-white flex items-center justify-center">
                                            <span className="text-white text-xs font-black">{i + 1}</span>
                                        </div>
                                    </div>

                                    <div className="text-4xl font-black gradient-text mb-2 opacity-20">{step.step}</div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA under steps */}
                <div className="text-center mt-16">
                    <a
                        href="/dashboard"
                        className="gradient-bg text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                        Get Started in 30 Seconds →
                    </a>
                </div>
            </div>
        </section>
    );
}
