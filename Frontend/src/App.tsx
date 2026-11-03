
import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./services/authcontext";

import Index from "./pages/Index";
import Saved from "./pages/Saved";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import Dashboard from "./pages/Dashboard";

import { Auth } from "./pages/Auth";
import { Onboarding } from "./pages/OnBoarding";
import { Recommendations } from "./pages/Recommendation";

import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

interface RouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: RouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const OnboardingGuard = ({ children }: RouteProps) => {
  const { onboardingCompleted } = useAuth();

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // THEME
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Show intro on every fresh application load.
  const [showIntro, setShowIntro] = useState(true);

  // Track authentication changes without replaying on initial mount.
  const previousAuth = useRef(isAuthenticated);

  // APPLY THEME AND UPDATE FAVICON
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    const favicon = document.getElementById(
      "ventro-favicon"
    ) as HTMLLinkElement | null;

    if (favicon) {
      favicon.href = isDark
        ? "/ventro-logo-dark.png"
        : "/ventro-logo-light.png";
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        isDark ? "#101010" : "#ffffff"
      );
  }, [isDark]);

  // PLAY INTRO AFTER LOGIN OR LOGOUT
  useEffect(() => {
    if (previousAuth.current !== isAuthenticated) {
      previousAuth.current = isAuthenticated;
      setShowIntro(true);
    }
  }, [isAuthenticated]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/auth" replace />}
            />

            {/* HOME */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <Index
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* AUTHENTICATION */}
            <Route
              path="/auth"
              element={<Auth />}
            />

            {/* ONBOARDING */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* RECOMMENDATIONS */}
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                  />
                </ProtectedRoute>
              }
            />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <Dashboard
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* INTERNSHIPS */}
            <Route
              path="/internships"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <Internships
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* INTERNSHIP DETAILS */}
            <Route
              path="/internship/:id"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <InternshipDetail
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                      searchQuery={searchQuery}
                      onSearchChange={onSearchChange}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* SAVED */}
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <Saved
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* HISTORY */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <OnboardingGuard>
                    <History
                      isDark={isDark}
                      toggleTheme={toggleTheme}
                    />
                  </OnboardingGuard>
                </ProtectedRoute>
              }
            />

            {/* NOT FOUND */}
            <Route
              path="*"
              element={
                <NotFound
                  isDark={isDark}
                  toggleTheme={toggleTheme}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>

      {/* GLOBAL INTRO OVERLAY */}
      {showIntro && (
        <LoadingScreen
          isDark={isDark}
          onLoadingComplete={() => setShowIntro(false)}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
