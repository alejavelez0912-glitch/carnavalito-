import ConfettiBackground from "@/components/ConfettiBackground";
import HeroSection from "@/components/HeroSection";
import CarnavalForm from "@/components/CarnavalForm";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative confetti-bg">
      <ConfettiBackground />
      
      <div className="relative z-10 max-w-lg mx-auto">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Form */}
        <div className="px-4 pb-8">
          <CarnavalForm />
        </div>
        
        {/* Trust indicators */}
        <TrustSection />
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
