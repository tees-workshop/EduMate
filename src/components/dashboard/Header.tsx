"use client";

import { useState, useEffect } from "react";

export default function Header({ title = "Dashboard" }: { title?: string }) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header
            className="h-16 flex items-center gap-4 px-4 sm:px-6 sticky top-0 z-30 border-b theme-header"
            style={{
                backdropFilter: "blur(20px)",
            }}
        >
            {/* Title — hidden on mobile */}
            <div className="flex-1 pl-10 md:pl-0">
                <h1 className="hidden md:block text-lg font-bold text-white">{title}</h1>
                <h3 className="hidden md:block text-sm" style={{ color: "#64748b" }}>
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · {time}
                </h3>
            </div>
        </header>
    );
}