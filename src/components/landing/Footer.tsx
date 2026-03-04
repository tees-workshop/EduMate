import Link from "next/link";
import { BookOpen, Twitter, Github, Linkedin, Mail } from "lucide-react";

const links = {
    Product: ["Features", "How It Works", "Pricing", "Changelog"],
    Resources: ["Documentation", "Blog", "Community", "Support"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black text-white">
                                Edu<span className="gradient-text">Mate</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                            The intelligent academic companion helping students study smarter, predict readiness, and achieve their best results.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2026 StudyAI. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm">
                        Built with ❤️ for students everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
}
