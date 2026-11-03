
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/services/authcontext";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  CheckCircle,
  X,
} from "lucide-react";

interface InternshipDetailProps {
  isDark: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface InternshipData {
  id: number;
  company: string;
  role: string;
  location: string;
  type?: string;
  work_type?: string;
  category?: string;
  stipend?: string;
  description?: string;
  skills?: string[] | string;
  apply_link?: string;
  applyLink?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const InternshipDetail = ({
  isDark,
  toggleTheme,
  searchQuery,
  onSearchChange,
}: InternshipDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [message, setMessage] = useState("");

  const applicationLink =
    internship?.applyLink || internship?.apply_link || "";

  const internshipType =
    internship?.type || internship?.work_type || "Not specified";

  const skills = Array.isArray(internship?.skills)
    ? internship.skills
    : typeof internship?.skills === "string"
      ? internship.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  // Fetch internship from PostgreSQL
  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchInternship = async () => {
      setLoading(true);
      setInternship(null);

      try {
        const response = await fetch(
          `${API_URL}/internships/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Internship not found");
        }

        if (cancelled) return;

        setInternship(data);

        // Record Recently Viewed after successfully loading the job
        const token = localStorage.getItem("token");

        if (token && token !== "temp") {
          const viewResponse = await fetch(
            `${API_URL}/recently-viewed/${id}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!viewResponse.ok) {
            console.error(
              "Recently Viewed failed:",
              viewResponse.status
            );
          }
        }
      } catch (error) {
        console.error("Internship fetch error:", error);
        if (!cancelled) setInternship(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInternship();

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  const handleApply = () => {
    if (!applicationLink) {
      setMessage("Application link is unavailable.");
      return;
    }

    let link = applicationLink.trim();

    // Handle Markdown-formatted links if present
    const markdownMatch = link.match(/\]\((https?:\/\/[^)]+)\)/);
    if (markdownMatch) {
      link = markdownMatch[1];
    }

    if (!/^https?:\/\//i.test(link)) {
      setMessage("Invalid application link.");
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
    setShowConfirmation(true);
    setMessage("");
  };

  const confirmApplication = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "temp") {
      setMessage("Please log in to update your application status.");
      return;
    }

    setSavingStatus(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/internships/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Applied" }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update application status."
        );
      }

      setMessage("Application marked as Applied successfully!");
      setShowConfirmation(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading internship...</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-3xl bg-card border border-border flex items-center justify-center mb-4 shadow-sm">
          <span className="text-xl font-bold">404</span>
        </div>

        <h2 className="text-xl font-bold mb-2">
          Internship not found
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          The listing may have expired or been removed.
        </p>

        <button
          onClick={() => navigate("/internships")}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Back to Opportunities
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-1000 selection:bg-primary/30 font-['Inter']">
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-32 pb-24 space-y-8">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground group"
        >
          <div className="p-2.5 rounded-2xl bg-secondary border border-border group-hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Back to Home</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl bg-card/70 backdrop-blur-2xl border border-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                {internship.company}
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {internship.role}
              </h1>
            </div>

            <button
              onClick={handleApply}
              className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 shrink-0"
            >
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {showConfirmation && (
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Did you submit your application?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only mark this as Applied if you completed and submitted the application.
                  </p>
                </div>

                <button
                  onClick={() => setShowConfirmation(false)}
                  aria-label="Close confirmation"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={confirmApplication}
                  disabled={savingStatus}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                >
                  {savingStatus ? "Saving..." : "Yes, I applied"}
                </button>

                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold"
                >
                  No, not yet
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary text-sm">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {message}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {internship.location}
            </span>

            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              <Briefcase className="h-3.5 w-3.5 text-blue-500" />
              {internshipType}
            </span>

            {internship.category && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                {internship.category}
              </span>
            )}

            {internship.stipend && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <DollarSign className="h-3.5 w-3.5" />
                {internship.stipend}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="text-lg font-bold">About the Role</h2>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {internship.description ||
                "No description available for this position."}
            </p>
          </div>

          {skills.length > 0 && (
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold">Required Skills</h2>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
