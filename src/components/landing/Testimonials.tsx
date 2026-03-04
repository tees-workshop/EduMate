import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Amara Okafor",
        role: "Computer Science, 400L",
        avatar: "AO",
        avatarColor: "#4F46E5",
        rating: 5,
        quote:
            "EduMate's readiness checker literally told me I wasn't ready for my OS exam two days before — it was right. I used the AI quiz to drill weak areas and passed with distinction. Game changer.",
    },
    {
        name: "Tunde Adeyemi",
        role: "Electrical Engineering, 300L",
        avatar: "TA",
        avatarColor: "#06B6D4",
        rating: 5,
        quote:
            "The Digital Locker keeps all my PDFs, handouts, and notes perfectly organized. The AI quiz generator saves me hours of making flashcards manually. I can't study without it now.",
    },
    {
        name: "Funmi Eze",
        role: "Biochemistry, 200L",
        avatar: "FE",
        avatarColor: "#8B5CF6",
        rating: 5,
        quote:
            "The smart study planner adjusted my schedule automatically when I fell behind. It felt like having a personal academic coach. My CGPA went from 3.2 to 4.6 this semester!",
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 lg:py-28 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                        Students <span className="gradient-text">Love EduMate</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-lg mx-auto">
                        Don&apos;t take our word for it — hear from students who transformed their academic performance.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover relative">
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-indigo-100" />

                            {/* Rating */}
                            <div className="flex items-center gap-0.5 mb-4">
                                {[...Array(t.rating)].map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                                    style={{ background: t.avatarColor }}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                                    <p className="text-slate-400 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
