"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    toggleTheme: () => {},
    setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");

    useEffect(() => {
        const stored = localStorage.getItem("edumate_theme") as Theme | null;
        if (stored === "light" || stored === "dark") {
            setThemeState(stored);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light-mode");
            root.classList.remove("dark-mode");
        } else {
            root.classList.add("dark-mode");
            root.classList.remove("light-mode");
        }
        localStorage.setItem("edumate_theme", theme);
    }, [theme]);

    const toggleTheme = () => setThemeState(t => t === "dark" ? "light" : "dark");
    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);