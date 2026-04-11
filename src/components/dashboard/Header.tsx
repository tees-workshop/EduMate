"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const notifications = [
    { title: "Readiness Score Updated", time: "2 min ago" },
    { title: "New Quiz Available: OS Concepts", time: "1 hr ago" },
    { title: "Study Streak: 7 Days 🔥", time: "Today" },
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

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

    return (
        <header
            className="h-16 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30 border-b"
            style={{
                background: "rgba(8,13,20,0.8)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(255,255,255,0.06)"
            }}
        >
            {/* Title — hidden on mobile */}
            <div className="flex-1 pl-10 md:pl-0">
                <h1 className="hidden md:block text-lg font-bold text-white">{title}</h1>
                <h3 className="hidden md:block text-sm" style={{ color: "#64748b" }}>
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {time}
                </h3>
            </div>

            {/* Notifications */}
            {/* <div className="relative">
                <button
                    onClick={() => { setNotifOpen(!notifOpen); setAvatarOpen(false); }}
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "#94a3b8"
                    }}
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #22d3ee, #059669)", color: "#080d14" }}>
                        3
                    </span>
                </button>

                {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 rounded-2xl py-2 z-50 border"
                        style={{
                            background: "rgba(8,13,20,0.95)",
                            backdropFilter: "blur(20px)",
                            borderColor: "rgba(255,255,255,0.08)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
                        }}>
                        <div className="px-4 py-2 border-b mb-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                            <p className="text-sm font-bold text-white">Notifications</p>
                        </div>
                        {notifications.map((n, i) => (
                            <div key={i} className="px-4 py-3 cursor-pointer transition-all border-b last:border-0"
                                style={{ borderColor: "rgba(255,255,255,0.04)" }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                            >
                                <p className="text-sm font-medium text-white">{n.title}</p>
                                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{n.time}</p>
                            </div>
                        ))}
                        <div className="px-4 py-2">
                            <button className="text-xs font-semibold" style={{ color: "#22d3ee" }}>
                                View all
                            </button>
                        </div>
                    </div>
                )}
            </div> */}

            {/* Avatar dropdown */}
            {/* <div className="relative">
                <button
                    onClick={() => { setAvatarOpen(!avatarOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-all border"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        borderColor: "rgba(255,255,255,0.08)"
                    }}
                >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{
                            background: "linear-gradient(135deg, #22d3ee, #059669)",
                            color: "#080d14"
                        }}>
                        {user ? getInitials(user.name) : ".."}
                    </div>
                    <span className="text-sm font-medium hidden sm:block" style={{ color: "#f1f5f9" }}>
                        {user ? user.name.split(" ")[0] : "Loading"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 hidden sm:block" style={{ color: "#64748b" }} />
                </button>

                {avatarOpen && (
                    <div className="absolute right-0 top-12 w-48 rounded-2xl py-2 z-50 border"
                        style={{
                            background: "rgba(8,13,20,0.95)",
                            backdropFilter: "blur(20px)",
                            borderColor: "rgba(255,255,255,0.08)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
                        }}>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                            <User className="w-4 h-4" /> My Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                            style={{ color: "#94a3b8" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                            <Settings className="w-4 h-4" /> Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all"
                            style={{ color: "#f87171" }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                )}
            </div> */}
        </header>
    );
}