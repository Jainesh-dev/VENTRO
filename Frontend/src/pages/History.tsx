
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Eye,
  Briefcase,
  MapPin,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  Circle,
  RefreshCw,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";

interface HistoryProps {
  isDark: boolean;
  toggleTheme: () => void;
}

type ApplicationStatus = "Applied" | "Not Applied";

interface RecentlyViewedInternship {
  id: number;
  company: string;
  role: string;
  location: string;
  type: string;
  category: string;
  applyLink: string;
  viewedAt: string;
  status: ApplicationStatus;
}

type FilterType = "All" | "Applied" | "Not Applied";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const normalizeInternship = (item: any): RecentlyViewedInternship => {
  // Supports both PostgreSQL tuple responses and object responses.
  const values = Array.isArray(item)
    ? {
        id: item[0],
        company: item[1],
        role: item[2],
        location: item[3],
        type: item[4],
        category: item[5],
        applyLink: item[6],
        viewedAt: item[7],
        status: item[8],
      }
    : {
        id: item.internship_id ?? item.id,
        company: item.company,
        role: item.role,
        location: item.location,
        type: item.work_type ?? item.type,
        category: item.category,
        applyLink: item.apply_link ?? item.applyLink,
        viewedAt: item.viewed_at ?? item.viewedAt,
        status: item.status,
      };

  return {
    id: Number(values.id),
    company: values.company || "Unknown Company",
    role: values.role || "Internship",
    location: values.location || "Not specified",
    type: values.type || "Not specified",
    category: values.category || "General",
    applyLink: values.applyLink || "",
    viewedAt: values.viewedAt || new Date().toISOString(),
    status:
      values.status?.toLowerCase() === "applied"
        ? "Applied"
        : "Not Applied",
  };
};

const History = ({ isDark, toggleTheme }: HistoryProps) => {
  const navigate = useNavigate();

  const [internships, setInternships] = useState<
    RecentlyViewedInternship[]
  >([]);

  const [filter, setFilter] = useState<FilterType>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Fetch Recently Viewed internships from PostgreSQL
  const fetchRecentlyViewed = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "temp") {
      setError("Please log in again to view your recently viewed internships.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/recently-viewed`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load internships (${response.status})`);
      }

      const data = await response.json();

      const records = Array.isArray(data)
        ? data
        : data.recently_viewed ?? data.data ?? [];

      setInternships(records.map(normalizeInternship));
    } catch (err) {
      console.error("Recently Viewed error:", err);
      setError("Unable to load your recently viewed internships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  // Update application status in PostgreSQL
  const updateStatus = async (
    internshipId: number,
    newStatus: ApplicationStatus
  ) => {
    const token = localStorage.getItem("token");

    if (!token || token === "temp") {
      setError("Please log in again.");
      return;
    }

    setUpdatingId(internshipId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/internships/${internshipId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not update application status.");
      }

      setInternships((previous) =>
        previous.map((internship) =>
          internship.id === internshipId
            ? { ...internship, status: newStatus }
            : internship
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      setError("Could not update the application status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInternships = internships.filter((internship) => {
    if (filter === "All") return true;
    return internship.status === filter;
  });

  const appliedCount = internships.filter(
    (item) => item.status === "Applied"
  ).length;

  const notAppliedCount = internships.length - appliedCount;

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently viewed";
    }

    return parsedDate.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] pb-24 font-sans overflow-x-hidden">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Recently Viewed
            </h1>
          </div>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">

          <StatCard
            icon={Eye}
            label="Total Viewed"
            value={internships.length}
            color="text-purple-500"
            bg="bg-purple-500/10"
          />

          <StatCard
            icon={CheckCircle2}
            label="Applied"
            value={appliedCount}
            color="text-green-500"
            bg="bg-green-500/10"
          />

          <StatCard
            icon={Circle}
            label="Not Applied"
            value={notAppliedCount}
            color="text-orange-500"
            bg="bg-orange-500/10"
          />

        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">

          <div className="flex flex-wrap gap-2">
            {(["All", "Applied", "Not Applied"] as FilterType[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    filter === item
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "bg-black/5 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {item}
                  {item === "All" && ` (${internships.length})`}
                  {item === "Applied" && ` (${appliedCount})`}
                  {item === "Not Applied" && ` (${notAppliedCount})`}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchRecentlyViewed();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

        </div>

        {/* Loading */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-zinc-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-4" />
            <p className="font-medium">Loading your internships...</p>
          </div>
        ) : filteredInternships.length === 0 ? (

          /* Empty State */
          <div className="py-20 px-6 text-center rounded-[32px] border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#1a1a1c]/60">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-purple-500/10 flex items-center justify-center">
              <Search className="w-9 h-9 text-purple-500" />
            </div>

            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
              {internships.length === 0
                ? "No recently viewed internships"
                : `No ${filter.toLowerCase()} internships`}
            </h2>

            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
              {internships.length === 0
                ? "Explore internship opportunities. The internships you open will automatically appear here."
                : "Try another filter to see your internships."}
            </p>

            <button
              onClick={() => navigate("/internships")}
              className="px-7 py-3.5 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold hover:scale-105 transition"
            >
              Explore Internships
            </button>
          </div>

        ) : (

          /* Internship Cards */
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {filteredInternships.map((internship) => (
              <article
                key={internship.id}
                className="rounded-[26px] p-5 sm:p-6 border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#1a1a1c]/70 backdrop-blur-xl hover:shadow-xl transition-all"
              >

                {/* Company and Status */}
                <div className="flex items-start justify-between gap-3 mb-5">

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                      {internship.company}
                    </p>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-snug">
                      {internship.role}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                      internship.status === "Applied"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {internship.status}
                  </span>

                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400 mb-5">

                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {internship.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {internship.type}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(internship.viewedAt)}
                  </span>

                </div>

                <div className="text-xs font-medium text-zinc-400 mb-5">
                  {internship.category}
                </div>

                <div className="h-px bg-black/5 dark:bg-white/10 mb-5" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    onClick={() => navigate(`/internship/${internship.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 font-semibold text-sm hover:bg-black/10 dark:hover:bg-white/10 transition"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    disabled={updatingId === internship.id}
                    onClick={() =>
                      updateStatus(
                        internship.id,
                        internship.status === "Applied"
                          ? "Not Applied"
                          : "Applied"
                      )
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50 ${
                      internship.status === "Applied"
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {updatingId === internship.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : internship.status === "Applied" ? (
                      <Circle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}

                    {internship.status === "Applied"
                      ? "Mark Not Applied"
                      : "Mark Applied"}
                  </button>

                </div>

              </article>
            ))}

          </section>
        )}

      </main>
    </div>
  );
};

// Statistics Card
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-[24px] p-5 border border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#1a1a1c]/60 backdrop-blur-xl">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
        {value}
      </p>

      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    </div>
  );
}

export default History;
