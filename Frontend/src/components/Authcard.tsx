import React, { useState } from "react";
import { motion } from "framer-motion";
import { SocialLoginButton } from "./SocialLoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleLogin } from "@react-oauth/google";
interface AuthCardProps {
  onSuccess: (isNewUser: boolean) => void;
}
export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      if (isLogin) {
        const response = await fetch("http://127.0.0.1:5001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.User));
          onSuccess(false);
        } else {
          alert(data.message);
        }
      } else {
        const response = await fetch("http://127.0.0.1:5001/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: email.split("@")[0], email, password }),
        });
        const data = await response.json();
        if (data.success) {
          alert("Registration successful!");
          onSuccess(true);
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect. Please try again.");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
    >
      {/* MONOCHROME AMBIENT GLOW */}
      <div className="absolute -inset-8 rounded-[50px] bg-gradient-to-br from-neutral-400/15 via-neutral-300/10 to-white/20 dark:from-white/[0.07] dark:via-neutral-500/[0.04] dark:to-black/20 blur-[55px] pointer-events-none" />
      {/* REFLECTIVE GLASS BORDER */}
      <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-br from-white via-neutral-300/80 to-neutral-400/50 dark:from-white/35 dark:via-white/10 dark:to-white/[0.04] shadow-[0_20px_70px_rgba(0,0,0,0.09)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
        {/* MAIN GLASS SURFACE */}
        <div className="relative rounded-[31px] overflow-hidden border border-white/80 dark:border-white/10 bg-white/75 dark:bg-neutral-950/75 backdrop-blur-[45px]">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-transparent to-neutral-300/20 dark:from-white/[0.07] dark:via-transparent dark:to-white/[0.025]" />
          <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/50" />
          <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-neutral-400/10 dark:bg-white/[0.035] blur-[65px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-16 w-56 h-56 rounded-full bg-neutral-500/10 dark:bg-white/[0.035] blur-[65px] pointer-events-none" />
          <div className="relative z-10 p-7 sm:p-9">
            {/* HEADING */}
            <div className="text-center mb-7">
              <motion.div
                key={isLogin ? "login-heading" : "signup-heading"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white font-['Sora']">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-['Inter']">
                  {isLogin ? "Sign in to continue your journey with VENTRO." : "Create your account and move your career forward."}
                </p>
              </motion.div>
            </div>
            {/* SOCIAL LOGIN */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const response = await fetch("http://127.0.0.1:5001/auth/google", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ token: credentialResponse.credential }),
                        });
                        const data = await response.json();
                        if (data.success) {
                          localStorage.setItem("token", data.token);
                          localStorage.setItem("user", JSON.stringify(data.User));
                          localStorage.setItem("it_onboarding_complete", String(data.onboarding_completed));
                          onSuccess(data.is_new_user);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    onError={() => console.log("Google Login Failed")}
                  />
                </div>
              </div>
              <SocialLoginButton provider="Apple" onClick={() => onSuccess(false)} />
              <SocialLoginButton provider="Microsoft" onClick={() => onSuccess(false)} />
            </div>
            {/* DIVIDER */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-neutral-300/70 dark:border-white/10" />
              <span className="flex-shrink mx-4 text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-[0.25em] font-semibold">or continue with email</span>
              <div className="flex-grow border-t border-neutral-300/70 dark:border-white/10" />
            </div>
            {/* LOGIN / SIGNUP FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="mt-2 h-12 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/65 dark:bg-white/[0.04] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 shadow-inner backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-white/20 focus-visible:border-neutral-400 dark:focus-visible:border-white/30"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-12 rounded-xl border border-neutral-200/90 dark:border-white/10 bg-white/65 dark:bg-white/[0.04] text-neutral-900 dark:text-white shadow-inner backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-white/20 focus-visible:border-neutral-400 dark:focus-visible:border-white/30"
                />
              </div>
              <Button
                type="submit"
                className="relative overflow-hidden w-full h-12 rounded-xl bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-semibold shadow-[0_8px_25px_rgba(0,0,0,0.13)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="relative z-10">{isLogin ? "Log In" : "Create Account"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              </Button>
            </form>
            {/* SWITCH LOGIN / SIGNUP */}
            <div className="mt-7 text-center text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-neutral-950 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 font-semibold underline underline-offset-4 decoration-neutral-400/70 dark:decoration-white/40 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-500 rounded-sm"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>
            {/* TERMS */}
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center mt-7 leading-relaxed">
              By continuing you agree to our
              <br />
              <a href="#" className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">Terms of Service</a>
              {" "}&{" "}
              <a href="#" className="underline underline-offset-2 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
