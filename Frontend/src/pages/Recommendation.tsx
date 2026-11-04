import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles, ArrowUpRight } from "lucide-react";
import RecommendationCard, { RecommendedInternship } from "../components/RecommendationCard";

interface RecommendationsProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Recommendations({ isDark }: RecommendationsProps) {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendedInternship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        const mockRecommendations: RecommendedInternship[] = [
          { id: "rec-1", title: "Backend Engineering Intern", company: "Stripe", location: "San Francisco, CA (Hybrid)", type: "Hybrid", matchScore: 96 },
          { id: "rec-2", title: "Software Engineer Intern - Distributed Systems", company: "Cloudflare", location: "Austin, TX (Remote)", type: "Remote", matchScore: 94 },
          { id: "rec-3", title: "AI Infrastructure Engineering Intern", company: "NVIDIA", location: "Santa Clara, CA", type: "On-site", matchScore: 91 },
          { id: "rec-4", title: "Full Stack Developer Intern", company: "Vercel", location: "Remote", type: "Remote", matchScore: 89 },
        ];
        setTimeout(() => {
          setRecommendations(mockRecommendations);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
        setIsLoading(false);
      }
    };
    loadRecommendations();
  }, []);

  return (
    <div className={`${isDark ? "dark" : ""} h-screen w-full overflow-hidden bg-background text-foreground font-['Inter'] transition-colors duration-500`}>
      <main className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <header className="shrink-0 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
              VENTRO / DISCOVER
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-['Sora'] text-3xl font-semibold tracking-tight sm:text-4xl">
                Recommended <span className="text-muted-foreground">for you.</span>
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                Opportunities selected around your skills, interests and career goals.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                Your opportunity feed
              </span>
            </div>
          </div>
        </header>

        <section className="min-h-0 flex-1">
          {isLoading ? (
            <div className="grid h-full grid-cols-1 grid-rows-4 gap-3 sm:grid-cols-2 sm:grid-rows-2 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-h-0 rounded-3xl border border-border bg-card/50 animate-pulse backdrop-blur-xl" />
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card/50 px-5 text-center shadow-xl backdrop-blur-2xl">
              <Sparkles className="mb-4 h-9 w-9 text-muted-foreground" />
              <h3 className="font-['Sora'] text-xl font-semibold">Nothing here yet.</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Complete your profile or upload a resume to discover relevant opportunities.
              </p>
              <button
                onClick={() => navigate("/onboarding")}
                className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-80"
              >
                Update Profile <ArrowUpRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid h-full grid-cols-1 grid-rows-4 gap-3 sm:grid-cols-2 sm:grid-rows-2 sm:gap-5">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="group min-h-0 overflow-hidden rounded-3xl border border-border bg-card/50 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
                >
                  <RecommendationCard internship={item} />
                </div>
              ))}
            </div>
          )}
        </section>

       <footer className="flex shrink-0 justify-end pt-4 sm:pt-5">
  <button
    onClick={() => navigate("/")}
    aria-label="Back to Home"
    className="group flex items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-2.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-foreground/30 hover:bg-accent hover:text-foreground"
  >
    Back to Home
    <ChevronLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
  </button>
</footer>
      </main>
    </div>
  );
}

export default Recommendations;