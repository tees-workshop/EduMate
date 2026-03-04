"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const notifications = [
    { title: "Readiness Score Updated", time: "2 min ago", type: "info" },
    { title: "New Quiz Available: OS Concepts", time: "1 hr ago", type: "success" },
    { title: "Study Streak: 7 Days 🔥", time: "Today", type: "warning" },
];

export default function Header({ title = "Dashboard" }: { title?: string }) {
    const [time, setTime] = useState("");
    const [notifOpen, setNotifOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("study_ai_user_id");
        router.push("/login");
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
            {/* Title */}
            <div className="flex-1">
                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {time}
                </p>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search topics, quizzes..."
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:bg-white transition-all w-56 lg:w-72"
                />
            </div>

            {/* Notifications */}
            <div className="relative">
                <button
                    onClick={() => { setNotifOpen(!notifOpen); setAvatarOpen(false); }}
                    className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors border border-slate-200"
                    aria-label="Notifications"
                >
                    <Bell className="w-4.5 h-4.5 text-slate-600" />
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                        3
                    </span>
                </button>

                {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-slate-100">
                            <p className="text-sm font-semibold text-slate-800">Notifications</p>
                        </div>
                        {notifications.map((n, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                                <p className="text-sm font-medium text-slate-700">{n.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                            </div>
                        ))}
                        <div className="px-4 py-2">
                            <button className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Avatar dropdown */}
            <div className="relative">
                <button
                    onClick={() => { setAvatarOpen(!avatarOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors"
                >
                    <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">
                        {user ? getInitials(user.name) : "..."}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                        {user ? user.name.split(" ")[0] : "Loading"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {avatarOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm font-medium transition-colors text-slate-700">
                            <User className="w-4 h-4" />
                            My Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm font-medium transition-colors text-slate-700">
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm font-medium transition-colors text-red-500"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
