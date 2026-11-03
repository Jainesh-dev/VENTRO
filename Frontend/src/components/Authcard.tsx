import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        // LOGIN
        const response = await fetch(
          "http://127.0.0.1:5001/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        console.log(data);
        console.log("Login Response:", data);
        console.log("data.User =", data.User);
        console.log("data.user =", data.user);

        if (data.success) {
          localStorage.setItem("token", data.token);

          localStorage.setItem(
            "user",
            JSON.stringify(data.User)
          );

          console.log(
            "Stored User:",
            localStorage.getItem("user")
          );

          onSuccess(false);
        } else {
          alert(data.message);
        }
      } else {
        // REGISTER
        const response = await fetch(
          "http://127.0.0.1:5001/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: email.split("@")[0],
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        console.log(data);

        if (data.success) {
          alert("Registration successful!");
          onSuccess(true);
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-8 rounded-[50px] bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/20 blur-[55px] pointer-events-none" />

      {/* Reflective glass border */}
      <div className="relative rounded-[32px] p-[1.5px] bg-gradient-to-br from-white via-blue-200/70 to-purple-300/60 dark:from-white/40 dark:via-indigo-300/15 dark:to-blue-400/30 shadow-[0_20px_70px_rgba(80,90,160,0.13)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.5)]">

        {/* Main glass surface */}
        <div className="relative rounded-[31px] overflow-hidden border border-white/70 dark:border-white/10 bg-white/65 dark:bg-[#080d19]/80 backdrop-blur-[45px]">

          {/* Glass reflections */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/80 via-transparent to-blue-200/20 dark:from-white/[0.08] dark:via-transparent dark:to-indigo-400/[0.08]" />

          <div className="absolute top-0 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/50" />

          <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-purple-400/15 dark:bg-purple-500/10 blur-[65px] pointer-events-none" />

          <div className="absolute -bottom-20 -right-16 w-56 h-56 rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-[65px] pointer-events-none" />

          {/* Card content */}
          <div className="relative z-10 p-7 sm:p-9">

            {/* Heading */}
            <div className="text-center mb-7">
              <motion.div
                key={isLogin ? "login-heading" : "signup-heading"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-['Sora']">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-['Inter']">
                  {isLogin
                    ? "Sign in to continue your internship journey."
                    : "Create your secure developer profile."}
                </p>
              </motion.div>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">

              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden border border-slate-200/70 dark:border-white/10 shadow-sm">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const response = await fetch(
                          "http://127.0.0.1:5001/auth/google",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              token: credentialResponse.credential,
                            }),
                          }
                        );

                        const data = await response.json();

                        console.log(data);

                        if (data.success) {
                          localStorage.setItem(
                            "token",
                            data.token
                          );

                          localStorage.setItem(
                            "user",
                            JSON.stringify(data.User)
                          );

                          localStorage.setItem(
                            "it_onboarding_complete",
                            String(data.onboarding_completed)
                          );

                          onSuccess(data.is_new_user);
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    onError={() => {
                      console.log("Google Login Failed");
                    }}
                  />
                </div>
              </div>

              <SocialLoginButton
                provider="Apple"
                onClick={() => onSuccess(false)}
              />

              <SocialLoginButton
                provider="Microsoft"
                onClick={() => onSuccess(false)}
              />
            </div>

            {/* Divider */}
            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-slate-300/60 dark:border-white/10" />

              <span className="flex-shrink mx-4 text-[10px] uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em] font-semibold">
                or continue with email
              </span>

              <div className="flex-grow border-t border-slate-300/60 dark:border-white/10" />
            </div>

            {/* Login / Signup form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <Label
                  htmlFor="email"
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="mt-2 h-12 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/55 dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:border-indigo-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-12 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/55 dark:bg-white/[0.04] text-slate-900 dark:text-white shadow-inner backdrop-blur-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:border-indigo-400"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="relative overflow-hidden w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 text-white font-semibold shadow-[0_8px_25px_rgba(99,102,241,0.25)] hover:shadow-[0_10px_35px_rgba(99,102,241,0.35)] transition-all duration-300 active:scale-[0.98]"
              >
                <span className="relative z-10">
                  {isLogin ? "Log In" : "Create Account"}
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full hover:translate-x-full transition-transform duration-700" />
              </Button>
            </form>

            {/* Switch login/signup */}
            <div className="mt-7 text-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-300 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-500 rounded-sm"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>

            {/* Terms */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-7 leading-relaxed">
              By continuing you agree to our
              <br />

              <a
                href="#"
                className="underline hover:text-indigo-500 transition-colors"
              >
                Terms of Service
              </a>

              {" "}&{" "}

              <a
                href="#"
                className="underline hover:text-indigo-500 transition-colors"
              >
                Privacy Policy
              </a>.
            </p>

          </div>
        </div>
      </div>
    </motion.div>
  );
};