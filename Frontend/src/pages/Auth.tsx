import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthCard } from "@/components/Authcard";
import { useAuth } from "@/services/authcontext";
import { ShieldCheck, Zap, Terminal } from "lucide-react";

export const Auth: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      signup();
      navigate("/onboarding");
      return;
    }

    login();

    const onboardingDone =
      localStorage.getItem("it_onboarding_complete") === "true";

    if (onboardingDone) {
      navigate("/home");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col md:flex-row items-center justify-center p-6 md:p-0 transition-colors duration-700 selection:bg-primary/30 font-['Inter']">

      {/* =====================================
          LIQUID AURORA BACKGROUND
      ===================================== */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[150px] bg-blue-400/20 dark:bg-indigo-600/15 animate-pulse-glow" />

        <div className="absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[160px] bg-purple-400/20 dark:bg-purple-600/15 animate-float-reverse" />

        <div className="absolute bottom-[-20%] left-[30%] w-[45vw] h-[45vw] rounded-full blur-[150px] bg-indigo-300/20 dark:bg-blue-500/10" />

        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-100/20 dark:from-white/[0.015] dark:via-transparent dark:to-indigo-950/20" />
      </div>

      {/* =====================================
          LEFT BRANDING PANEL
      ===================================== */}

      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mb-12 md:mb-0">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7"
        >

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-white via-blue-300/50 to-purple-400/40 dark:from-white/40 dark:via-indigo-300/20 dark:to-blue-400/30 shadow-lg">

              <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-inner">
                <Terminal className="w-5 h-5" />
              </div>

            </div>

            <span className="text-2xl font-bold tracking-tight text-foreground font-['Sora']">
              Intern<span className="text-primary">Tracker</span>
            </span>

          </div>

          {/* Main heading */}
          <div className="space-y-5">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] text-foreground font-['Sora']">
              Track · Apply
              <br />

              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-extrabold">
                Get Hired.
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-md font-medium leading-relaxed font-['Inter']">
              Your Personal Internship Command Center. Aggregate applications, extract optimization metrics, and dominate your hiring cycle.
            </p>

          </div>
        </motion.div>

        {/* =====================================
            FLOATING OPPORTUNITY CARDS
        ===================================== */}

        <div className="mt-12 space-y-5 max-w-sm hidden lg:block relative">

          {/* First card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative rounded-[25px] p-[1px] bg-gradient-to-br from-white via-blue-200/60 to-indigo-300/40 dark:from-white/30 dark:via-blue-300/10 dark:to-indigo-400/20 shadow-[0_12px_40px_rgba(80,90,160,0.10)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
          >

            <div className="relative rounded-[24px] overflow-hidden bg-white/65 dark:bg-slate-950/60 backdrop-blur-[35px] border border-white/70 dark:border-white/10 p-4 flex items-center justify-between">

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-transparent to-blue-200/20 dark:from-white/[0.07] dark:via-transparent dark:to-indigo-400/[0.08]" />

              <div className="relative z-10 flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Zap className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-foreground font-['Sora']">
                    SWE Intern @ Stripe
                  </p>

                  <p className="text-[10px] text-muted-foreground font-['Inter']">
                    Interview Scheduled
                  </p>
                </div>

              </div>

              <span className="relative z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Tomorrow
              </span>

            </div>
          </motion.div>

          {/* Second card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 0.85, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="relative translate-x-5 rounded-[25px] p-[1px] bg-gradient-to-br from-white via-purple-200/60 to-blue-300/40 dark:from-white/30 dark:via-purple-300/10 dark:to-blue-400/20 shadow-[0_12px_40px_rgba(80,90,160,0.10)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
          >

            <div className="relative rounded-[24px] overflow-hidden bg-white/65 dark:bg-slate-950/60 backdrop-blur-[35px] border border-white/70 dark:border-white/10 p-4 flex items-center justify-between">

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/60 via-transparent to-purple-200/20 dark:from-white/[0.07] dark:via-transparent dark:to-purple-400/[0.08]" />

              <div className="relative z-10 flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-foreground font-['Sora']">
                    AI Research Intern
                  </p>

                  <p className="text-[10px] text-muted-foreground font-['Inter']">
                    Offer Received
                  </p>
                </div>

              </div>

              <span className="relative z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                $8,500/mo
              </span>

            </div>
          </motion.div>

        </div>
      </div>

      {/* =====================================
          RIGHT AUTHENTICATION PANEL
      ===================================== */}

      <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-2 sm:p-4">

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full flex justify-center"
        >
          <AuthCard onSuccess={handleAuthSuccess} />
        </motion.div>

      </div>

    </div>
  );
};

export default Auth;