"use client";

import { useState, useEffect } from "react";
import { db, User } from "@/lib/db";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const userId = localStorage.getItem("study_ai_user_id");
            if (userId) {
                const userData = await db.getUser(userId);
                if (userData) setUser(userData);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    return { user, setUser, loading };
}