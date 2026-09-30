import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import ProblemSection from "../components/landing/ProblemSection";
import HowItWorks from "../components/landing/HowItWorks";
import OpportunityCategories from "../components/landing/OpportunityCategories";
import RecommendationSection from "../components/landing/RecommendationSection";
import DeadlineSection from "../components/landing/DeadlineSection";
import PersonalizationSection from "../components/landing/PersonalizationSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CTASection from "../components/landing/CTASection";
import LandingFooter from "../components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <LandingNavbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProblemSection />
        <HowItWorks />
        <OpportunityCategories />
        <RecommendationSection />
        <DeadlineSection />
        <PersonalizationSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
