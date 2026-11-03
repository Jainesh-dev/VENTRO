import React, { useEffect, useState } from "react";
import {
  Send,
  Bookmark,
  Phone,
  TrendingUp,
  Target,
  UploadCloud,
  Compass,
  History,
  FolderHeart,
  Download,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
interface DashboardProps {
  isDark: boolean;
  toggleTheme: () => void;
}
interface DashboardStats {
  applied: number;
  saved: number;
  interviews: number;
  success_rate: number;
}
interface Category {
  label: string;
  count: number;
  percentage: number;
}
interface Activity {
  type: "apply" | "save" | "view" | "interview" | string;
  title: string;
  subtitle: string;
  timestamp: string | null;
}
interface DashboardData {
  success: boolean;
  stats: DashboardStats;
  categories: Category[];
  target_role: {
    role: string | null;
    applications: number;
  };
  recent_activity: Activity[];
}
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
const categoryColors = ["bg-neutral-950 dark:bg-white", "bg-neutral-700 dark:bg-neutral-300", "bg-neutral-500 dark:bg-neutral-400", "bg-neutral-400 dark:bg-neutral-500", "bg-neutral-300 dark:bg-neutral-600", "bg-neutral-200 dark:bg-neutral-700"];
export default function Dashboard({
  isDark,
  toggleTheme,
}: DashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Fetch real dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in again to view your dashboard.");
      }
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error(`Dashboard request failed (${response.status}).`);
      }
      const data: DashboardData = await response.json();
      if (!data.success) {
        throw new Error("Unable to load dashboard data.");
      }
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);
  // Convert timestamp into readable relative time
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Time unavailable";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Time unavailable";
    const seconds = Math.floor(
      (Date.now() - date.getTime()) / 1000
    );
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };
  // Export dashboard information as CSV
  const exportCSV = () => {
    if (!dashboard) return;
    const rows: string[][] = [
      ["Section", "Type", "Title", "Subtitle", "Value", "Timestamp"],
      ["Statistics", "", "Applied", "", String(dashboard.stats.applied), ""],
      ["Statistics", "", "Saved", "", String(dashboard.stats.saved), ""],
      [
        "Statistics",
        "",
        "Interviews",
        "",
        String(dashboard.stats.interviews),
        "",
      ],
      [
        "Statistics",
        "",
        "Success Rate",
        "",
        `${dashboard.stats.success_rate}%`,
        "",
      ],
      ...dashboard.categories.map((category) => [
        "Category",
        "",
        category.label,
        "",
        `${category.count} (${category.percentage}%)`,
        "",
      ]),
      ...dashboard.recent_activity.map((activity) => [
        "Recent Activity",
        activity.type,
        activity.title,
        activity.subtitle,
        "",
        activity.timestamp || "",
      ]),
    ];
    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ventro-dashboard.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const stats = dashboard?.stats;
  return (
    <>
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24 selection:bg-neutral-500/20 font-['Inter'] flex flex-col justify-center transition-colors duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* PAGE HEADER */}
          <header className="relative mb-8 md:mb-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.04em] text-foreground font-['Sora'] leading-tight">
                    Career Dashboard
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboard}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/20 bg-white/70 dark:bg-white/[0.07] hover:bg-neutral-100 dark:hover:bg-white/[0.13] backdrop-blur-xl transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <button
                  onClick={exportCSV}
                  disabled={!dashboard}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:opacity-85 transition-opacity text-sm font-semibold disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </header>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="text-sm font-semibold text-red-500">
                {error}
              </p>
              <button
                onClick={fetchDashboard}
                className="mt-3 text-sm font-bold underline text-red-500"
              >
                Try again
              </button>
            </div>
          )}
          {/* LOADING STATE */}
          {loading && !dashboard && (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-neutral-800 dark:text-neutral-200" />
              <p className="text-muted-foreground">
                Loading your dashboard...
              </p>
            </div>
          )}
          {/* DASHBOARD CONTENT */}
          {dashboard && (
            <>
              {/* SECTION 1: STATS OVERVIEW */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={<Send />}
                  label="Applied"
                  value={stats?.applied ?? 0}
                  trend="Total tracked applications"
                  color="bg-blue-500"
                  onClick={() => navigate("/history")}
                />
                <StatCard
                  icon={<Bookmark />}
                  label="Saved"
                  value={stats?.saved ?? 0}
                  trend="Currently saved opportunities"
                  color="bg-amber-500"
                  onClick={() => navigate("/saved")}
                />
                <StatCard
                  icon={<Phone />}
                  label="Interviews"
                  value={stats?.interviews ?? 0}
                  trend="Applications at interview stage"
                  color="bg-violet-500"
                  onClick={() => navigate("/history")}
                />
                <StatCard
                  icon={<TrendingUp />}
                  label="Success Rate"
                  value={`${stats?.success_rate ?? 0}%`}
                  trend="Interviews relative to applications"
                  color="bg-emerald-500"
                  onClick={() => navigate("/history")}
                />
              </section>
              {/* MIDDLE TIER: CAREER PROGRESS & INSIGHTS */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-6">
                {/* CAREER PROGRESS */}
                <div className="lg:col-span-2 group relative rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] backdrop-blur-2xl transition-all duration-300 hover:shadow-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.045)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-neutral-900/[0.06] dark:bg-white/[0.07] rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200 font-semibold text-xs tracking-wider uppercase mb-2 font-['Sora']">
                        <Target className="w-4 h-4" />
                        Target Role
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-6 font-['Sora']">
                        {dashboard.target_role?.role || "No target role yet"}
                      </h2>
                      <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Applications
                          </p>
                          <p className="text-2xl font-bold text-foreground font-['Sora']">
                            {dashboard.target_role?.applications ?? 0}
                          </p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Projects
                          </p>
                          <p className="text-2xl font-bold text-muted-foreground font-['Sora']">
                            —
                          </p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div>
                          <p className="text-muted-foreground text-xs font-medium mb-1">
                            Skills
                          </p>
                          <p className="text-2xl font-bold text-muted-foreground font-['Sora']">
                            —
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Progress visualization */}
                    <div className="shrink-0 relative flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          className="stroke-muted"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          className="stroke-neutral-900 dark:stroke-white"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="351.86"
                          strokeDashoffset="351.86"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-muted-foreground tracking-tight font-['Sora']">
                          —
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Progress
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* APPLICATION INSIGHTS */}
                <div className="group rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] backdrop-blur-2xl transition-all duration-300 hover:shadow-xl shadow-[0_12px_40px_rgba(0,0,0,0.045)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-6 font-['Sora']">
                    Applications by Category
                  </h3>
                  <div className="space-y-5">
                    {dashboard.categories.length > 0 ? (
                      dashboard.categories.map((category, index) => (
                        <InsightBar
                          key={category.label}
                          label={category.label}
                          percentage={category.percentage}
                          count={category.count}
                          color={categoryColors[index % categoryColors.length]}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No application categories yet.
                      </p>
                    )}
                  </div>
                </div>
              </section>
              {/* BOTTOM TIER: ACTIVITY & ACTIONS */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                {/* ACTIVITY TIMELINE */}
                <div className="lg:col-span-1 rounded-[28px] p-6 sm:p-7 border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.045)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight text-foreground font-['Sora']">
                      Recent Activity
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      Latest 10
                    </span>
                  </div>
                  {dashboard.recent_activity.length > 0 ? (
                    <div className="relative pl-4 border-l-2 border-border space-y-6">
                      {dashboard.recent_activity.map((activity, index) => (
                        <TimelineItem
                          key={`${activity.timestamp}-${index}`}
                          title={activity.title}
                          subtitle={activity.subtitle}
                          time={formatTime(activity.timestamp)}
                          type={activity.type}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Your recent activities will appear here.
                    </p>
                  )}
                </div>
                {/* QUICK ACTIONS */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ActionCard
                    icon={<UploadCloud />}
                    title="Upload Resume"
                    desc="Update your master CV"
                    color="bg-sky-500"
                    onClick={() => navigate("/onboarding")}
                  />
                  <ActionCard
                    icon={<Compass />}
                    title="Browse Opportunities"
                    desc="Discover new roles"
                    color="bg-indigo-500"
                    onClick={() => navigate("/internships")}
                  />
                  <ActionCard
                    icon={<FolderHeart />}
                    title="View Saved"
                    desc="Review your bookmarks"
                    color="bg-rose-500"
                    onClick={() => navigate("/saved")}
                  />
                  <ActionCard
                    icon={<History />}
                    title="Application History"
                    desc="Track past applications"
                    color="bg-amber-500"
                    onClick={() => navigate("/history")}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
// --------------------------------------------------
// MICRO COMPONENTS
// --------------------------------------------------
interface StatCardProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  trend: string;
  color: string;
  onClick: () => void;
}
function StatCard({
  icon,
  label,
  value,
  trend,
  color,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full text-left rounded-3xl p-6 border border-border bg-card/70 backdrop-blur-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden shadow-sm cursor-pointer"
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 blur-3xl rounded-full pointer-events-none`}
      />
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl ${color} bg-opacity-10 text-foreground border border-border backdrop-blur-md`}
        >
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            {
              className: `w-5 h-5 ${color.replace("bg-", "text-")}`,
            }
          )}
        </div>
        <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium tracking-tight mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-bold tracking-tight text-foreground mb-2 font-['Sora']">
          {value}
        </h3>
        <p className="text-xs font-semibold text-muted-foreground">
          {trend}
        </p>
      </div>
    </button>
  );
}
interface InsightBarProps {
  label: string;
  percentage: number;
  count: number;
  color: string;
}
function InsightBar({
  label,
  percentage,
  count,
  color,
}: InsightBarProps) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1.5 font-['Sora']">
        <span className="text-foreground">{label} ({count})</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
}
interface TimelineItemProps {
  title: string;
  subtitle: string;
  time: string;
  type: string;
}
function TimelineItem({
  title,
  subtitle,
  time,
  type,
}: TimelineItemProps) {
  const getDotColor = () => {
    switch (type) {
      case "apply":
        return "bg-blue-500";
      case "interview":
        return "bg-violet-500";
      case "save":
        return "bg-amber-500";
      default:
        return "bg-neutral-400 dark:bg-neutral-500";
    }
  };
  return (
    <div className="relative group cursor-default">
      <div
        className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full ${getDotColor()} border-2 border-card`}
      />
      <div className="group-hover:translate-x-1 transition-transform duration-300">
        <p className="text-sm font-semibold text-foreground font-['Sora']">
          {title}
        </p>
        <p className="text-xs text-muted-foreground font-medium mb-1 font-['Inter']">
          {subtitle}
        </p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {time}
        </p>
      </div>
    </div>
  );
}
interface ActionCardProps {
  icon: React.ReactElement;
  title: string;
  desc: string;
  color: string;
  onClick?: () => void;
}
function ActionCard({
  icon,
  title,
  desc,
  color,
  onClick,
}: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full text-left rounded-3xl p-6 border border-border bg-card/70 backdrop-blur-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden shadow-sm cursor-pointer"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 ${color} blur-[80px] transition-opacity duration-500 pointer-events-none`}
      />
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-4 border border-border group-hover:scale-110 transition-transform duration-500`}
        >
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            {
              className: `w-6 h-6 ${color.replace("bg-", "text-")}`,
            }
          )}
        </div>
        <h4 className="text-base font-bold tracking-tight text-foreground mb-1 font-['Sora']">
          {title}
        </h4>
        <p className="text-xs font-medium text-muted-foreground">
          {desc}
        </p>
      </div>
    </button>
  );
}
