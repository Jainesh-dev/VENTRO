import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Github, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Index = ({ isDark, toggleTheme }: IndexProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-1000 selection:bg-primary/30 font-['Inter']">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="w-full flex-grow">
        <HeroSection isDark={isDark} />
      </main>

      {/* Monochrome liquid-glass footer */}
      <footer className="relative z-20 w-full px-4 sm:px-6 pb-6 sm:pb-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] border border-black/10 dark:border-white/15 bg-white/65 dark:bg-white/[0.055] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.24)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-black/[0.025] dark:from-white/[0.07] dark:via-transparent dark:to-black/20" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-6 sm:px-8 py-7">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex items-center gap-3 group cursor-pointer"
                aria-label="Go to VENTRO home"
              >
                <div className="h-11 w-11 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={isDark ? "/ventro-logo-dark.png" : "/ventro-logo-light.png"}
                    alt="VENTRO logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-semibold text-lg tracking-[0.18em] text-foreground font-['Sora']">
                  VENTRO
                </span>
              </button>

              <p className="text-[11px] sm:text-xs font-medium text-muted-foreground tracking-wide text-center font-['Inter']">
                © 2026 VENTRO. Built for your next opportunity.
              </p>

              <div className="flex items-center gap-3 text-muted-foreground">
                <button
                  type="button"
                  aria-label="GitHub"
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white/55 dark:bg-white/[0.06] hover:bg-white/90 dark:hover:bg-white/[0.13] hover:text-foreground backdrop-blur-xl transition-all"
                >
                  <Github className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Twitter"
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 bg-white/55 dark:bg-white/[0.06] hover:bg-white/90 dark:hover:bg-white/[0.13] hover:text-foreground backdrop-blur-xl transition-all"
                >
                  <Twitter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
