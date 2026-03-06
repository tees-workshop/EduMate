import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Privacy from "@/components/landing/Privacy";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "#22d3ee", filter: "blur(120px)", opacity: 0.12,
          top: "-100px", left: "-100px",
          animation: "driftA1 8s ease-in-out infinite, pulseBlob1 4s ease-in-out infinite"
        }} />
      <div className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "#059669", filter: "blur(100px)", opacity: 0.1,
          bottom: "-80px", right: "-80px",
          animation: "driftA2 10s ease-in-out infinite, pulseBlob2 5s ease-in-out infinite"
        }} />
      <div className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: "#818cf8", filter: "blur(100px)", opacity: 0.08,
          top: "40%", left: "40%",
          animation: "driftA3 12s ease-in-out infinite, pulseBlob3 6s ease-in-out infinite"
        }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[800px] h-[800px] animate-orbit-spin">
          <div className="absolute rounded-full"
            style={{
              top: "-30px", left: "50%", transform: "translateX(-50%)",
              width: "80px", height: "80px",
              background: "#22d3ee", filter: "blur(30px)", opacity: 0.15
            }} />
          <div className="absolute rounded-full"
            style={{
              bottom: "-30px", left: "50%", transform: "translateX(-50%)",
              width: "60px", height: "60px",
              background: "#818cf8", filter: "blur(25px)", opacity: 0.15
            }} />
        </div>
      </div>
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen relative" style={{ background: "#080d14" }}>
      <AuroraBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Privacy />
        <CTABanner />
        <Footer />
      </div>
    </main>
  );
}