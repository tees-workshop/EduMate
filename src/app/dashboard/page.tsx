import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatsRow from "@/components/dashboard/StatsRow";
import ActionCards from "@/components/dashboard/ActionCards";
import AIInsightPanel from "@/components/dashboard/AIInsightPanel";

export const metadata = {
    title: "Dashboard | EduMate",
    description: "Your personal AI study dashboard — track progress, check readiness, and study smarter.",
};

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Header title="Dashboard" />

                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <WelcomeBanner />
                    <StatsRow />

                    {/* Main content + right panel */}
                    <div className="grid xl:grid-cols-[1fr_320px] gap-6">
                        <div>
                            <ActionCards />
                        </div>
                        <div>
                            <AIInsightPanel />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
