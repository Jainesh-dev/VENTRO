import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import RecommendationCard, { RecommendedInternship } from "../components/RecommendationCard";

interface RecommendationsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Recommendations({ isDark, toggleTheme }: RecommendationsProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendedInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated personalized AI recommendations fetch based on user profile / skills
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        // Using sample high-match recommendations aligned with user target role
        const mockRecommendations: RecommendedInternship[] = [
          {
            id: "rec-1",
            title: "Backend Engineering Intern",
            company: "Stripe",
            location: "San Francisco, CA (Hybrid)",
            type: "Hybrid",
            matchScore: 96,
          },
          {
            id: "rec-2",
            title: "Software Engineer Intern - Distributed Systems",
            company: "Cloudflare",
            location: "Austin, TX (Remote)",
            type: "Remote",
            matchScore: 94,
          },
          {
            id: "rec-3",
            title: "AI Infrastructure Engineering Intern",
            company: "NVIDIA",
            location: "Santa Clara, CA",
            type: "On-site",
            matchScore: 91,
          },
          {
            id: "rec-4",
            title: "Full Stack Developer Intern",
            company: "Vercel",
            location: "Remote",
            type: "Remote",
            matchScore: 89,
          },
        ];

        setTimeout(() => {
          setRecommendations(mockRecommendations);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary/30 font-['Inter'] transition-colors duration-1000 overflow-x-hidden">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* HEADER */}
        <header className="mb-10 md:mb-12">
          <div className="flex items-center gap-4 sm:gap-5 mb-3">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mt-0.5 font-['Sora']">
              AI Recommendations
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pl-[56px] sm:pl-[64px] text-base sm:text-lg text-muted-foreground font-normal tracking-tight font-['Inter']">
            <p>Curated opportunities matched to your master resume and skill profile.</p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide border border-primary/20 font-['Sora'] w-max">
              <Sparkles className="w-3.5 h-3.5" /> High-Confidence Matches
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-3xl bg-card/60 border border-border animate-pulse" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-border bg-card/70 backdrop-blur-2xl shadow-xl">
            <Sparkles className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2 font-['Sora']">No recommendations available</h3>
            <p className="text-sm text-muted-foreground mb-6 font-['Inter']">Complete your profile or upload a resume to generate tailored matches.</p>
            <button
              onClick={() => navigate("/onboarding")}
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md font-['Sora']"
            >
              Update Profile Setup
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {recommendations.map((item) => (
              <RecommendationCard key={item.id} internship={item} />
            ))}
          </section>
        )}

      </main>
    </div>
  );
}

export default Recommendations;