import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthCard } from "@/components/Authcard";
import { useAuth } from "@/services/authcontext";
import { ShieldCheck, Zap } from "lucide-react";
export const Auth: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const isDark = document.documentElement.classList.contains("dark");
  const handleAuthSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      signup();
      navigate("/onboarding");
      return;
    }
    login();
    const onboardingDone = localStorage.getItem("it_onboarding_complete") === "true";
    navigate(onboardingDone ? "/home" : "/onboarding");
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col md:flex-row items-center justify-center p-6 md:p-0 transition-colors duration-700 selection:bg-primary/20 font-['Inter']">
      {/* MONOCHROME LIQUID GLASS BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[18%] -left-[12%] w-[55vw] h-[55vw] rounded-full blur-[150px] bg-neutral-300/35 dark:bg-white/[0.045]" />
        <div className="absolute top-[25%] right-[-12%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-neutral-200/45 dark:bg-neutral-500/[0.07]" />
        <div className="absolute bottom-[-20%] left-[30%] w-[45vw] h-[45vw] rounded-full blur-[150px] bg-neutral-300/30 dark:bg-white/[0.035]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-neutral-200/30 dark:from-white/[0.025] dark:via-transparent dark:to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.035)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.28)_100%)]" />
      </div>
      {/* LEFT BRANDING PANEL */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mb-12 md:mb-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="space-y-7">
          <div className="flex items-center">
            <img
              src={isDark ? "/ventro-logo-dark.png" : "/ventro-logo-light.png"}
              alt="VENTRO"
              className="h-12 w-auto max-w-[220px] object-contain"
              onError={(event) => {
                console.error("VENTRO logo could not be loaded:", event.currentTarget.src);
              }}
            />
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-foreground font-['Sora']">
              Discover · Apply
              <br />
              <span className="text-neutral-500 dark:text-neutral-400 font-extrabold">Move Forward.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md font-medium leading-relaxed font-['Inter']">
              Your career command center. Discover opportunities, organize applications, and keep every step of your journey moving forward.
            </p>
          </div>
        </motion.div>
        {/* FLOATING OPPORTUNITY CARDS */}
        <div className="mt-12 space-y-5 max-w-sm hidden lg:block relative">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="relative rounded-[25px] p-[1px] bg-gradient-to-br from-white via-neutral-300/70 to-neutral-400/40 dark:from-white/30 dark:via-white/10 dark:to-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.07)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <div className="relative rounded-[24px] overflow-hidden bg-white/65 dark:bg-neutral-950/60 backdrop-blur-[35px] border border-white/80 dark:border-white/10 p-4 flex items-center justify-between">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-transparent to-neutral-200/25 dark:from-white/[0.07] dark:via-transparent dark:to-white/[0.025]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900/[0.06] dark:bg-white/[0.08] flex items-center justify-center text-foreground border border-neutral-900/10 dark:border-white/10">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground font-['Sora']">SWE Intern @ Stripe</p>
                  <p className="text-[10px] text-muted-foreground font-['Inter']">Interview Scheduled</p>
                </div>
              </div>
              <span className="relative z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-neutral-900/[0.06] text-neutral-700 dark:bg-white/[0.08] dark:text-neutral-200 border border-neutral-900/10 dark:border-white/10">Tomorrow</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 0.85, x: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="relative translate-x-5 rounded-[25px] p-[1px] bg-gradient-to-br from-white via-neutral-300/70 to-neutral-400/40 dark:from-white/30 dark:via-white/10 dark:to-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.07)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]">
            <div className="relative rounded-[24px] overflow-hidden bg-white/65 dark:bg-neutral-950/60 backdrop-blur-[35px] border border-white/80 dark:border-white/10 p-4 flex items-center justify-between">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-transparent to-neutral-200/25 dark:from-white/[0.07] dark:via-transparent dark:to-white/[0.025]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900/[0.06] dark:bg-white/[0.08] flex items-center justify-center text-foreground border border-neutral-900/10 dark:border-white/10">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground font-['Sora']">AI Research Intern</p>
                  <p className="text-[10px] text-muted-foreground font-['Inter']">Offer Received</p>
                </div>
              </div>
              <span className="relative z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-neutral-900/[0.06] text-neutral-700 dark:bg-white/[0.08] dark:text-neutral-200 border border-neutral-900/10 dark:border-white/10">$8,500/mo</span>
            </div>
          </motion.div>
        </div>
      </div>
      {/* RIGHT AUTHENTICATION PANEL */}
      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-2 sm:p-4">
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="w-full flex justify-center">
          <AuthCard onSuccess={handleAuthSuccess} />
        </motion.div>
      </div>
    </div>
  );
};
export default Auth;
