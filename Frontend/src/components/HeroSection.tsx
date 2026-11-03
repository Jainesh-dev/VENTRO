import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, MapPin, Laptop, ChevronLeft, ChevronRight } from "lucide-react";
// =========================================
// LIQUID GLASS MATERIAL COMPONENT
// =========================================
interface GlassMaterialProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  hover?: boolean;
  isDark: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}
const GlassMaterial = ({
  children,
  className = "",
  intensity = "medium",
  hover = true,
  isDark,
  onClick,
  ariaLabel,
}: GlassMaterialProps) => {
  const variants: Record<string, string> = {
    low: isDark
      ? "bg-black/55 backdrop-blur-2xl"
      : "bg-white/55 backdrop-blur-2xl",
    medium: isDark
      ? "bg-black/65 backdrop-blur-[36px]"
      : "bg-white/65 backdrop-blur-[36px]",
    high: isDark
      ? "bg-black/80 backdrop-blur-[48px]"
      : "bg-white/75 backdrop-blur-[48px]",
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };
  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      className={`group relative rounded-[inherit] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${hover ? "hover:scale-[1.005] hover:-translate-y-1 active:scale-[0.98]" : ""}
        ${onClick ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary" : ""}
        ${className}`}
    >
      {/* Liquid glass rim: brighter in light mode, deep reflective edge in dark mode */}
      <div
        className={`absolute inset-0 rounded-[inherit] p-[1.5px] ${
          isDark
            ? "bg-gradient-to-br from-white/55 via-white/10 to-white/30 shadow-[0_0_24px_rgba(255,255,255,0.10)]"
            : "bg-gradient-to-br from-white via-white/95 to-neutral-300/80 shadow-[0_0_28px_rgba(0,0,0,0.08)]"
        }`}
      >
        <div
          className={`h-full w-full rounded-[inherit] ${
            isDark ? "bg-black/80" : "bg-white/45"
          }`}
        />
      </div>
      {/* Glass surface */}
      <div
        className={`relative h-full w-full rounded-[inherit] overflow-hidden border transition-all duration-700 ${
          isDark
            ? "border-white/25 shadow-[0_16px_48px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.08)]"
            : "border-neutral-300/90 shadow-[0_16px_48px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.08)]"
        } ${variants[intensity]}`}
      >
        {/* Soft inner glow */}
        <div
          className={`absolute inset-0 pointer-events-none z-0 ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_55%,rgba(255,255,255,0.03))]"
              : "bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.95),transparent_48%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_55%,rgba(0,0,0,0.025))]"
          }`}
        />
        {/* Curved reflective highlight along the top edge */}
        <div
          className={`absolute top-0 left-[5%] right-[5%] h-px pointer-events-none z-10 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/70 to-transparent"
              : "bg-gradient-to-r from-transparent via-white to-transparent"
          }`}
        />
        {/* Subtle lower edge reflection */}
        <div
          className={`absolute bottom-0 left-[12%] right-[12%] h-px pointer-events-none z-10 ${
            isDark
              ? "bg-gradient-to-r from-transparent via-white/35 to-transparent"
              : "bg-gradient-to-r from-transparent via-neutral-400/50 to-transparent"
          }`}
        />
        {/* Content */}
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
// =========================================
// LIVE INTERNSHIP DATA
// =========================================
interface LiveInternship {
  id: number;
  company: string;
  role: string;
  location?: string;
  work_type?: string;
  category?: string;
  apply_link?: string;
}
const gradients = [
  "from-neutral-500/15 via-neutral-400/5 to-transparent",
  "from-neutral-400/15 via-neutral-300/5 to-transparent",
  "from-neutral-500/12 via-neutral-400/5 to-transparent",
  "from-neutral-400/15 via-neutral-300/5 to-transparent",
  "from-neutral-500/15 via-neutral-400/5 to-transparent",
];
const getLogo = (company: string) =>
  company.trim().slice(0, 2).toUpperCase() || "?";
const getJobType = (type?: string) => {
  if (!type) return "Not specified";
  const normalized = type.toLowerCase();
  if (normalized.includes("remote")) return "Remote";
  if (normalized.includes("hybrid")) return "Hybrid";
  if (
    normalized.includes("onsite") ||
    normalized.includes("on-site") ||
    normalized.includes("on site")
  ) {
    return "On-site";
  }
  return type;
};
const rankInternship = (job: LiveInternship) => {
  const role = (job.role || "").toLowerCase();
  const category = (job.category || "").toLowerCase();
  let score = 0;
  if (role.includes("intern")) score += 5;
  if (/software engineering|software engineer/.test(role)) score += 10;
  if (/frontend|front-end/.test(role)) score += 9;
  if (/backend|back-end/.test(role)) score += 9;
  if (/full.?stack/.test(role)) score += 9;
  if (/ai|machine learning|ml engineer/.test(role)) score += 8;
  if (/developer|engineering/.test(role)) score += 6;
  if (/software|frontend|backend|full.?stack/.test(category)) score += 5;
  if (/ai|machine learning/.test(category)) score += 4;
  if (/high school/.test(role)) score -= 10;
  if (/technical support|customer support/.test(role)) score -= 4;
  return score;
};
// =========================================
// HERO SECTION
// =========================================
const HeroSection = ({ isDark }: { isDark: boolean }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<LiveInternship[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ---------------------------------------
  // FETCH LIVE INTERNSHIPS
  // ---------------------------------------
  useEffect(() => {
    let cancelled = false;
    const loadJobs = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const response = await fetch(
          "http://127.0.0.1:5001/internships"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch internships");
        }
        const result: LiveInternship[] = await response.json();
        if (!cancelled) {
          const validJobs = Array.isArray(result)
            ? result.filter(
                (job) =>
                  job &&
                  job.id != null &&
                  typeof job.company === "string" &&
                  typeof job.role === "string"
              )
            : [];
          setJobs(validJobs);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Could not load homepage internships:", error);
        if (!cancelled) {
          setLoadError(true);
          setJobs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);
  // ---------------------------------------
  // RANK AND REMOVE DUPLICATES
  // ---------------------------------------
  const rankedJobs = useMemo(() => {
    const seen = new Set<string>();
    return [...jobs]
      .sort((a, b) => rankInternship(b) - rankInternship(a))
      .filter((job) => {
        const key = `${job.company.trim().toLowerCase()}|${job.role
          .trim()
          .toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [jobs]);
  const featuredJobs = rankedJobs.slice(0, 5);
  const quickExploreJobs = rankedJobs.slice(5, 11);
  const currentFeatured = featuredJobs[activeIndex];
  // ---------------------------------------
  // NAVIGATION
  // ---------------------------------------
  const openInternship = (id: number) => {
    navigate(`/internship/${id}`);
  };
  const openDiscover = () => {
    navigate("/internships");
  };
  // ---------------------------------------
  // CAROUSEL TRANSITION
  // ---------------------------------------
  const selectFeatured = (index: number) => {
    if (index === activeIndex || index < 0 || index >= featuredJobs.length) {
      return;
    }
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }
    setFade(false);
    transitionTimeout.current = setTimeout(() => {
      setActiveIndex(index);
      setFade(true);
      transitionTimeout.current = null;
    }, 250);
  };
  useEffect(() => {
    if (featuredJobs.length < 2) return;
    const interval = setInterval(() => {
      setFade(false);
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
      transitionTimeout.current = setTimeout(() => {
        setActiveIndex((previous) =>
          (previous + 1) % featuredJobs.length
        );
        setFade(true);
        transitionTimeout.current = null;
      }, 400);
    }, 5000);
    return () => {
      clearInterval(interval);
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }
    };
  }, [featuredJobs.length]);
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
    };
  }, []);
  // =======================================
  // RENDER
  // =======================================
  return (
    <section
      className={`relative w-full flex flex-col items-center overflow-x-hidden overflow-y-visible pt-28 sm:pt-36 pb-16 transition-colors duration-1000 ${isDark ? "bg-black" : "bg-white"}`}
    >
      {/* AMBIENT AURORA BACKDROP */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Blue aurora */}
        <div
          className={`absolute top-0 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 animate-pulse-glow ${
            isDark ? "bg-white/10" : "bg-neutral-300/35"
          }`}
        />
        {/* Purple aurora */}
        <div
          className={`absolute bottom-10 right-1/4 w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-30 transition-colors duration-1000 animate-float-reverse ${
            isDark ? "bg-neutral-400/10" : "bg-neutral-200/60"
          }`}
        />
        {/* Soft pink highlight */}
        <div
          className={`absolute top-1/3 right-0 w-[30vw] h-[30vw] rounded-full blur-[150px] opacity-20 transition-colors duration-1000 ${
            isDark ? "bg-white/5" : "bg-neutral-300/25"
          }`}
        />
      </div>
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-8 lg:px-12 flex flex-col items-center">
        {/* FEATURED CAROUSEL */}
        <div className="w-full mb-8">
          {loading ? (
            <GlassMaterial
              isDark={isDark}
              intensity="medium"
              hover={false}
              className="rounded-3xl sm:rounded-[40px] w-full"
            >
              <div className="p-8 sm:p-20 lg:p-28 h-[450px] sm:h-[600px] lg:h-[650px] flex flex-col justify-center text-center">
                <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase mb-4 font-['Sora']">
                  InternTracker
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-['Sora']">
                  Finding live opportunities...
                </h2>
                <p className="mt-4 text-muted-foreground text-sm font-['Inter']">
                  Loading internships from your database.
                </p>
              </div>
            </GlassMaterial>
          ) : currentFeatured ? (
            <GlassMaterial
              isDark={isDark}
              intensity="medium"
              className="rounded-3xl sm:rounded-[40px] w-full group overflow-hidden cursor-pointer shadow-2xl"
              onClick={() => openInternship(currentFeatured.id)}
              ariaLabel={`View ${currentFeatured.role} at ${currentFeatured.company}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  gradients[activeIndex % gradients.length]
                } transition-all duration-1000 pointer-events-none`}
              />
              {featuredJobs.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous featured internship"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectFeatured((activeIndex - 1 + featuredJobs.length) % featuredJobs.length);
                    }}
                    className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                      isDark
                        ? "border-white/30 bg-black/55 text-white hover:bg-white/15"
                        : "border-neutral-300 bg-white/75 text-black hover:bg-white"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next featured internship"
                    onClick={(event) => {
                      event.stopPropagation();
                      selectFeatured((activeIndex + 1) % featuredJobs.length);
                    }}
                    className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                      isDark
                        ? "border-white/30 bg-black/55 text-white hover:bg-white/15"
                        : "border-neutral-300 bg-white/75 text-black hover:bg-white"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
              <div
                className={`px-14 py-8 sm:px-20 sm:py-20 lg:px-28 lg:py-28 min-h-[520px] sm:min-h-[600px] lg:min-h-[620px] flex flex-col justify-between gap-8 relative z-10 transition-all duration-500 ${
                  fade
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                <div className="grid lg:grid-cols-12 items-center w-full min-w-0 flex-1 gap-8">
                  {/* LEFT CONTENT */}
                  <div className="lg:col-span-7 min-w-0 w-full flex flex-col justify-center relative z-20">
                    <div className="flex items-center gap-4 mb-8 sm:mb-12">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-3 backdrop-blur-xl border border-border bg-card/90 font-bold text-lg sm:text-xl text-foreground font-['Sora'] shadow-md">
                        {getLogo(currentFeatured.company)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-primary uppercase font-['Sora']">
                          Featured Opportunity
                        </span>
                        <p className="text-base font-semibold tracking-tight leading-none mt-1 text-muted-foreground font-['Sora']">
                          {currentFeatured.company}
                        </p>
                      </div>
                    </div>
                    <h2 className="text-[clamp(2rem,5.2vw,4.5rem)] max-w-full min-w-0 font-bold tracking-tight leading-[1.08] [overflow-wrap:anywhere] break-words line-clamp-3 text-foreground font-['Sora']">
                      {currentFeatured.role}
                    </h2>
                  </div>
                  {/* DECORATIVE MONOGRAM */}
                  <div className="hidden lg:flex lg:col-span-5 h-full items-center justify-end relative z-0 select-none">
                    <div className="text-[180px] xl:text-[220px] font-black tracking-tighter opacity-[0.05] dark:opacity-[0.08] text-foreground transition-transform duration-1000 group-hover:scale-105 font-['Sora']">
                      {getLogo(currentFeatured.company)}
                    </div>
                  </div>
                </div>
                {/* LOCATION AND WORK TYPE */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium min-w-0 text-muted-foreground relative z-10 pt-4 font-['Inter']">
                  <p className="flex items-center gap-2 min-w-0 max-w-full bg-secondary/60 px-3 sm:px-4 py-2 rounded-2xl border border-border/60 backdrop-blur-md">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {currentFeatured.location || "Location not specified"}
                    </span>
                  </p>
                  <p className="flex items-center gap-3 bg-secondary/60 px-4 py-2 rounded-2xl border border-border/60 backdrop-blur-md">
                    <Laptop className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{getJobType(currentFeatured.work_type)}</span>
                  </p>
                </div>
              </div>
            </GlassMaterial>
          ) : (
            <GlassMaterial
              isDark={isDark}
              intensity="medium"
              hover={false}
              className="rounded-3xl sm:rounded-[40px] w-full"
            >
              <div className="p-8 sm:p-20 lg:p-28 min-h-[400px] flex flex-col justify-center text-center">
                <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase mb-4 font-['Sora']">
                  InternTracker
                </p>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-['Sora']">
                  {loadError
                    ? "Could not load internships"
                    : "No internships found yet"}
                </h2>
                <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto font-['Inter']">
                  {loadError
                    ? "Check that your Flask backend is running, then refresh the page."
                    : "Run your internship engine to populate the database."}
                </p>
                <button
                  onClick={openDiscover}
                  className={`mt-8 mx-auto w-fit rounded-full border px-6 py-3 font-semibold text-sm shadow-md transition-all font-['Sora'] ${isDark ? "border-white/30 bg-white text-neutral-950 hover:bg-neutral-200" : "border-neutral-300 bg-neutral-950 text-white hover:bg-neutral-800"}`}
                >
                  Explore Opportunities
                </button>
              </div>
            </GlassMaterial>
          )}
        </div>
        {/* CAROUSEL DOTS */}
        {featuredJobs.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 mb-10">
            {featuredJobs.map((job, index) => (
              <button
                key={job.id}
                type="button"
                aria-label={`Show featured internship ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => selectFeatured(index)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  index === activeIndex
                    ? "w-10 sm:w-14 bg-primary"
                    : "w-2 bg-muted hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        )}
        {/* QUICK EXPLORE */}
        {quickExploreJobs.length > 0 && (
          <div className="w-full max-w-6xl">
            <div className="flex items-end justify-between gap-4 mb-5 px-1">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground font-['Sora']">
                  More opportunities
                </p>
                <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-['Sora']">
                  Explore open roles
                </h3>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {quickExploreJobs.length} openings
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickExploreJobs.map((job) => (
                <GlassMaterial
                  key={job.id}
                  isDark={isDark}
                  intensity="medium"
                  className="rounded-3xl sm:rounded-[28px] min-h-[156px] w-full overflow-hidden cursor-pointer"
                  onClick={() => openInternship(job.id)}
                  ariaLabel={`View ${job.role} at ${job.company}`}
                >
                  <div className="h-full min-h-[156px] p-5 sm:p-6 flex flex-col justify-between relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-border/80 bg-card/80 backdrop-blur-xl font-bold text-foreground font-['Sora'] text-sm shadow-sm">
                        {getLogo(job.company)}
                      </div>
                      <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                    </div>
                    <div className="min-w-0 mt-5">
                      <p className="text-xs font-medium text-muted-foreground font-['Inter'] truncate">
                        {job.company}
                      </p>
                      <h4 className="mt-1 text-base sm:text-lg font-semibold leading-snug tracking-tight text-foreground font-['Sora'] line-clamp-2">
                        {job.role}
                      </h4>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-['Inter']">
                        {job.location && <span className="truncate max-w-[65%]">{job.location}</span>}
                        {job.location && job.work_type && <span aria-hidden="true">·</span>}
                        {job.work_type && <span>{getJobType(job.work_type)}</span>}
                      </div>
                    </div>
                  </div>
                </GlassMaterial>
              ))}
            </div>
          </div>
        )}
        {/* EXPLORE ALL OPPORTUNITIES */}
        <div className="relative group/btn mt-8">
          <button
            type="button"
            onClick={openDiscover}
            className={`py-4 px-10 rounded-full text-sm font-semibold tracking-tight transition-all duration-300 active:scale-[0.98] border shadow-lg flex items-center justify-center gap-2 font-['Sora'] ${isDark ? "border-white/30 bg-white text-neutral-950 hover:bg-neutral-200" : "border-neutral-300 bg-neutral-950 text-white hover:bg-neutral-800"}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore All Open Placements
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
