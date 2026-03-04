import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTABanner() {
    return (
        <section className="py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden gradient-bg rounded-3xl px-8 py-16 md:px-16 text-center shadow-2xl shadow-indigo-500/25">
                    {/* Decorative orbs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                            <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">Free Forever Plan Available</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                            Ready to Ace Your Next Exam?
                        </h2>
                        <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10">
                            Join 12,000+ students who use EduMate to study smarter, predict readiness, and achieve top grades.
                            Start for free — no credit card required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                            >
                                Create Free Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/dashboard"
                                className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/20 transition-all flex items-center justify-center"
                            >
                                View Dashboard Demo
                            </Link>
                        </div>

                        <p className="text-indigo-200 text-xs mt-6">
                            No credit card required · Free plan includes core features · Upgrade anytime
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
