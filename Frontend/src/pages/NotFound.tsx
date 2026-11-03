import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";

interface NotFoundProps {
  isDark: boolean;
  toggleTheme: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const NotFound = ({ isDark, toggleTheme, searchQuery = "", onSearchChange = () => {} }: NotFoundProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/30 font-['Inter'] transition-colors duration-1000 overflow-x-hidden">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center rounded-3xl sm:rounded-[40px] border border-border bg-card/70 backdrop-blur-2xl p-10 sm:p-16 max-w-lg w-full relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] aspect-square bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-secondary border border-border flex items-center justify-center mb-6 shadow-sm relative z-10">
            <Compass className="w-10 h-10 text-primary animate-pulse" strokeWidth={1.5} />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-2 font-['Sora'] relative z-10">
            404
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-3 font-['Sora'] relative z-10">
            Page Not Found
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground mb-8 font-['Inter'] relative z-10 max-w-xs">
            Oops! The page you are looking for doesn't exist or has been relocated.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-1/2 py-3 px-5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-semibold border border-border hover:bg-muted transition-all active:scale-95 font-['Sora'] flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            
            <button
              onClick={() => navigate("/home")}
              className="w-full sm:w-1/2 py-3 px-5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-95 font-['Sora']"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;