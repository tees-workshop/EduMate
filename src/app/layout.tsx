import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    preload: false,
});

const merriweather = Merriweather({
    variable: "--font-merriweather",
    subsets: ["latin"],
    weight: ["300", "400", "700", "900"],
    display: "swap",
    preload: false,
});

export const metadata: Metadata = {
    title: "EduMate – Your Intelligent Study Companion",
    description:
        "Predict your assessment readiness, supercharge productivity, and study smarter with AI-powered insights.",
    keywords: ["study", "AI", "productivity", "academic", "readiness", "learning"],
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${merriweather.variable} antialiased`}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}