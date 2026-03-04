import { Flame, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function StatsRow() {
    const stats = [
        {
            icon: Flame,
            label: "Study Streak",
            value: "0 Days",
            sub: "Start today to begin!",
            color: "from-orange-400 to-red-500",
            bg: "bg-orange-50",
            textColor: "text-orange-600",
        },
        {
            icon: TrendingUp,
            label: "Readiness Score",
            value: "0%",
            sub: "Check readiness now",
            color: "from-indigo-500 to-indigo-600",
            bg: "bg-indigo-50",
            textColor: "text-indigo-600",
        },
        {
            icon: CheckCircle,
            label: "Tasks Completed",
            value: "0 / 0",
            sub: "No tasks yet",
            color: "from-green-500 to-emerald-600",
            bg: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            icon: Clock,
            label: "Upcoming Deadlines",
            value: "0",
            sub: "No urgent milestones",
            color: "from-amber-400 to-orange-500",
            bg: "bg-amber-50",
            textColor: "text-amber-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm card-hover"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.bg} ${stat.textColor}`}>
                                Live
                            </span>
                        </div>
                        <p className="text-2xl font-black text-slate-800 mb-1">{stat.value}</p>
                        <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                        <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                );
            })}
        </div>
    );
}
