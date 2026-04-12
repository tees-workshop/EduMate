import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsRow from "@/components/dashboard/StatsRow";
import ActionCards from "@/components/dashboard/ActionCards";

export const metadata = {
    title: "Dashboard | EduMate",
    description: "Your personal AI study dashboard — track progress, check readiness, and study smarter.",
};

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen relative theme-bg theme-text">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Cyan blob */}
                <div className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        background: "#22d3ee",
                        filter: "blur(140px)",
                        opacity: 0.08,
                        top: "-100px",
                        left: "-100px",
                        animation: "driftA1 8s ease-in-out infinite, pulseBlob1 4s ease-in-out infinite"
                    }} />
                {/* Emerald blob */}
                <div className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        background: "#059669",
                        filter: "blur(130px)",
                        opacity: 0.07,
                        bottom: "-80px",
                        right: "-80px",
                        animation: "driftA2 10s ease-in-out infinite, pulseBlob2 5s ease-in-out infinite"
                    }} />
                {/* Violet blob */}
                <div className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        background: "#818cf8",
                        filter: "blur(120px)",
                        opacity: 0.06,
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        animation: "driftA3 12s ease-in-out infinite, pulseBlob3 6s ease-in-out infinite"
                    }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header title="Dashboard" />
                    <main className="flex-1 p-4 md:p-6 overflow-auto pt-16 md:pt-6">
                        <WelcomeBanner />
                        <div className="flex flex-col gap-6 w-full">
                            <StatsRow />
                            <ActionCards />
                        </div>
                    </main>
                </div>
            </div>

        </div>
    );
}