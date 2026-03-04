import { Shield, Lock, Eye, Server, CheckCircle } from "lucide-react";

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
    {
        icon: Server,
        title: "Your Data, Your Control",
        description: "Export or delete your data at any time with one click. No questions asked, no hidden retention.",
    },
    {
        icon: Shield,
        title: "FERPA Compliant",
        description: "StudyAI is built in full compliance with FERPA and GDPR standards, protecting your academic privacy.",
    },
];

export default function Privacy() {
    return (
        <section id="privacy" className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
                            <Shield className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-700 text-xs font-semibold tracking-wide uppercase">Privacy First</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                            Your Privacy is{" "}
                            <span className="gradient-text">Non-Negotiable</span>
                        </h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8">
                            We built EduMate with privacy at its core, not as an afterthought. Your academic data
                            belongs to you — we just help you use it smarter.
                        </p>

                        <div className="flex flex-col gap-4">
                            {["FERPA Compliant", "GDPR Ready", "SOC 2 Type II", "256-bit AES Encryption"].map((badge) => (
                                <div key={badge} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    <span className="text-slate-700 font-medium text-sm">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        {privacyItems.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm card-hover"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-md">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
