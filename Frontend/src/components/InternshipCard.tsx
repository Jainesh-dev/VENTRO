
import React, { useState } from "react";
import { MapPin, Calendar, ExternalLink, CheckCircle2, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Internship } from "@/data/internships";
import SaveButton from "./SaveButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const colorMap: Record<string, string> = {
  G: "bg-blue-500",
  M: "bg-green-500",
  A: "bg-zinc-800 dark:bg-white dark:text-black",
  N: "bg-red-500",
  S: "bg-indigo-500",
  U: "bg-zinc-900",
  F: "bg-blue-400",
  O: "bg-orange-500",
};

const typeBadge: Record<string, string> = {
  Remote: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "On-site": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Hybrid: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

const InternshipCard = ({ internship }: { internship: Internship }) => {
  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"Applied" | "Not Applied">("Not Applied");
  const [message, setMessage] = useState("");

  const bg = colorMap[internship.logo] || "bg-gradient-to-br from-zinc-700 to-black";
  const badge = typeBadge[internship.type] || "bg-muted text-muted-foreground";

  const applicationLink = (internship as any).applyLink || (internship as any).apply_link || "";

  const hasValidLink =
    typeof applicationLink === "string" &&
    applicationLink.trim() !== "" &&
    !["#", "n/a", "na", "none", "null", "javascript:void(0)"].includes(
      applicationLink.trim().toLowerCase()
    );
  
  const handleCardClick = () => {
  const token = localStorage.getItem("token");

  if (token && token !== "temp") {
    fetch(`${API_URL}/recently-viewed/${internship.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Failed to record Discover view:", error);
    });
  }

  navigate(`/internship/${internship.id}`);
  };

  const handleApply = () => {
    setMessage("");

    if (hasValidLink) {
      window.open(applicationLink, "_blank", "noopener,noreferrer");
    } else {
      setMessage("Application link is unavailable for this internship.");
    }

    setShowConfirmation(true);
  };

  const confirmApplication = async () => {
    const token = localStorage.getItem("token");

    if (!token || token === "temp") {
      setMessage("Please log in again to update your application status.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/internships/${internship.id}/status`,
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
        throw new Error(data.message || `Status update failed (${response.status})`);
      }

      setStatus("Applied");
      setShowConfirmation(false);
      setMessage("Application marked as Applied successfully!");
    } catch (error) {
      console.error("Application status update error:", error);
      setMessage(
        error instanceof Error ? error.message : "Could not update application status."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("button")) return;
        handleCardClick();
      }}
      className="group relative rounded-3xl border border-border bg-card/60 backdrop-blur-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full shadow-sm"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex items-start gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0 font-['Sora']`}>
          {internship.logo}
        </div>

        <div className="flex-1 min-w-0 mt-0.5">
          <h3 className="font-semibold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors font-['Sora'] truncate">
            {internship.role}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {internship.company}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="relative z-10 -mt-1 -mr-1">
          <SaveButton id={internship.id} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-medium">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {internship.location}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {internship.postedDate}
        </span>
        <span className={`px-3 py-1.5 rounded-full font-semibold ${badge}`}>
          {internship.type}
        </span>
      </div>

      <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
        {showConfirmation && (
          <div className="mb-4 p-4 rounded-2xl border border-primary/30 bg-primary/5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  Did you submit your application?
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Confirm only after completing the external application.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                aria-label="Close confirmation"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={confirmApplication}
                disabled={saving}
                className="flex-1 rounded-xl py-2.5 px-3 bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Yes, I applied"}
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={saving}
                className="flex-1 rounded-xl py-2.5 px-3 bg-secondary text-secondary-foreground text-xs font-semibold"
              >
                Not yet
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className="mb-3 text-xs text-muted-foreground" role="status">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleApply}
          disabled={status === "Applied"}
          className={`w-full rounded-2xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] shadow-sm disabled:cursor-default ${
            status === "Applied"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
          }`}
        >
          {status === "Applied" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Applied
            </>
          ) : (
            <>
              Apply Now
              <ExternalLink className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;
