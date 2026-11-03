import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, Briefcase, MapPin, Sparkles, FolderOpen, Compass } from "lucide-react";

// Assuming these are your actual imports
import Navbar from "../components/Navbar";
import InternshipCard from "../components/InternshipCard";
import { internships, Internship } from "../data/internships";

interface SavedProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Saved({
  isDark,
  toggleTheme,
}: SavedProps) {
  const navigate = useNavigate();
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved internships

  useEffect(() => {
    const loadSavedInternships = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in to view saved internships.");
        }

        const response = await fetch(
          "http://127.0.0.1:5001/saved",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load saved internships: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Saved internships received:", data);

        // Convert the API response into the shape expected by InternshipCard.
        const normalized = data.map((job: any) => ({
          ...job,
          id: Number(job.id),
          type: job.type ?? job.work_type ?? "Unknown",
          apply_link: job.applyLink ?? job.apply_link ?? "",
          skills: job.skills ?? [],
        }));

        setSavedInternships(normalized);
      } catch (error) {
        console.error("Error loading saved internships:", error);
        setSavedInternships([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedInternships();
  }, []);

  // Calculate Collection Insights
  const insights = useMemo(() => {
    return {
      total: savedInternships.length,
      remote: savedInternships.filter(i => i.type === "Remote").length,
      hybrid: savedInternships.filter(i => i.type === "Hybrid").length,
      onsite: savedInternships.filter(i => i.type === "On-site").length,
    };
  }, [savedInternships]);

  // Calculate Recommendations (Based on most saved category)
  const recommendations = useMemo(() => {
    if (savedInternships.length === 0) return [];
    
    // Find most common category
    const categories = savedInternships.map(i => i.category);
    const topCategory = categories.sort((a, b) => 
      categories.filter(v => v === a).length - categories.filter(v => v === b).length
    ).pop();

    // Find 3 internships in that category that aren't already saved
    return internships
      .filter(i => i.category === topCategory && !savedInternships.find(s => s.id === i.id))
      .slice(0, 3);
  }, [savedInternships]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 selection:bg-primary/30 font-['Inter'] overflow-x-hidden transition-colors duration-1000">
      
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* 🏷 HEADER WITH INLINE BACK BUTTON */}
        <header className="mb-10 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 md:gap-6">
            <div>
              <div className="flex items-center gap-4 sm:gap-5 mb-3">
                {/* 🔙 MINIMAL BACK BUTTON */}
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mt-0.5 font-['Sora']">
                  Saved Vault
                </h1>
              </div>
            </div>
            
            {savedInternships.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide backdrop-blur-md self-start md:self-end md:mb-1 ml-[56px] sm:ml-[64px] md:ml-0 border border-primary/20 font-['Sora']">
                <Bookmark className="w-4 h-4 fill-current" />
                {insights.total} opportunities
              </div>
            )}
          </div>
        </header>

        {isLoading ? (
          <div className="animate-pulse flex gap-6">
            <div className="w-full h-64 bg-card/60 rounded-3xl border border-border"></div>
          </div>
        ) : savedInternships.length === 0 ? (
          /* 📭 EMPTY STATE (Premium Vault Design) */
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center rounded-3xl sm:rounded-[40px] border border-border bg-card/70 backdrop-blur-2xl relative overflow-hidden mt-8 shadow-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] aspect-square bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center mb-6 sm:mb-8 shadow-sm relative z-10">
              <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 relative z-10 font-['Sora']">
              Your vault is empty
            </h3>
            <p className="text-[15px] sm:text-[17px] text-muted-foreground max-w-md mx-auto mb-8 sm:mb-10 relative z-10 font-['Inter']">
              Save internships to build your personal collection of future career opportunities.
            </p>
            <button
              onClick={() => navigate("/internships")}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex items-center gap-2 relative z-10 font-['Sora']"
            >
              <Compass className="w-4 h-4" /> Explore Opportunities
            </button>
          </div>
        ) : (
          <>
            {/* 📊 SECTION 2: COLLECTION INSIGHTS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
              <InsightCard icon={Bookmark} label="Total Saved" value={insights.total} color="text-blue-500" bg="bg-blue-500/10" />
              <InsightCard icon={MapPin} label="Remote Roles" value={insights.remote} color="text-emerald-500" bg="bg-emerald-500/10" />
              <InsightCard icon={Briefcase} label="Hybrid Roles" value={insights.hybrid} color="text-amber-500" bg="bg-amber-500/10" />
              <InsightCard icon={Briefcase} label="On-Site Roles" value={insights.onsite} color="text-purple-500" bg="bg-purple-500/10" />
            </section>

            {/* 🗂 SECTION 1: SAVED GRID */}
            <section className="mb-16 sm:mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {savedInternships.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            </section>

            {/* 🌟 SECTION 3: RECOMMENDED FOR YOU */}
            {recommendations.length > 0 && (
              <section className="pt-10 sm:pt-12 border-t border-border">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0 border border-amber-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-['Sora']">
                      Recommended for you
                    </h2>
                    <p className="text-[13px] sm:text-sm text-muted-foreground font-medium font-['Inter']">
                      Because you saved {savedInternships[0]?.category} roles
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {recommendations.map((internship) => (
                    <InternshipCard key={`rec-${internship.id}`} internship={internship} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// --- MICRO-COMPONENT FOR INSIGHTS ---
function InsightCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="rounded-3xl p-5 border border-border bg-card/70 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 border border-border/40`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} strokeWidth={2} />
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-['Sora']">
            {value}
          </p>
          <p className="text-xs sm:text-[13px] font-medium text-muted-foreground font-['Inter']">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}