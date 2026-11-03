import React, { useState, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
Search,
MapPin,
Briefcase,
Clock,
CalendarDays,
X,
ExternalLink,
Bookmark,
ChevronDown,
SlidersHorizontal,
ArrowLeft,
Check,
Building2,
Wifi,
LayoutGrid,
} from "lucide-react";
import Navbar from "../components/Navbar";
const API_URL =
import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
interface InternshipsProps {
isDark: boolean;
toggleTheme: () => void;
}
interface Internship {
id: number;
company: string;
role: string;
location: string;
type?: string;
work_type?: string;
category?: string;
stipend?: string | number;
description?: string;
skills?: string[] | string;
applyLink?: string;
apply_link?: string;
postedDate?: string;
posted_date?: string;
deadline?: string;
application_deadline?: string;
experience_level?: string;
experience?: string;
degree?: string;
salary?: string | number;
duration?: string;
batch?: string;
}
type FilterName =
| "location"
| "company"
| "type"
| "category"
| "experience";
const Internships = ({ isDark, toggleTheme }: InternshipsProps) => {
const filterRef = useRef<HTMLDivElement>(null);
const requestIdRef = useRef(0);
const [internships, setInternships] = useState<Internship[]>([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [activeFilter, setActiveFilter] =
useState<FilterName | null>(null);
const [showFilters, setShowFilters] = useState(false);
const [locationFilter, setLocationFilter] = useState("All locations");
const [companyFilter, setCompanyFilter] = useState("All companies");
const [typeFilter, setTypeFilter] = useState("All types");
const [categoryFilter, setCategoryFilter] = useState("All categories");
const [experienceFilter, setExperienceFilter] = useState("All levels");
const [remoteOnly, setRemoteOnly] = useState(false);
const [savedOnly, setSavedOnly] = useState(false);
const [savedIds, setSavedIds] = useState<number[]>([]);
const [savingIds, setSavingIds] = useState<number[]>([]);
const [selectedInternship, setSelectedInternship] =
useState<Internship | null>(null);
const [detailLoading, setDetailLoading] = useState(false);
const [detailError, setDetailError] = useState("");
const [applyMessage, setApplyMessage] = useState("");
const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
const [sortOption, setSortOption] = useState("latest");
const [showSortOptions, setShowSortOptions] = useState(false);
// Normalize API fields
const cleanDisplayText = (value: unknown): string => {
if (value === null || value === undefined) return "";
let text = String(value);
for (let i = 0; i < 2; i++) {
text = text
.replace(/&lt;/gi, "<")
.replace(/&gt;/gi, ">")
.replace(/&quot;/gi, '"')
.replace(/&#39;|&apos;/gi, "'")
.replace(/&amp;/gi, "&")
.replace(/&nbsp;/gi, " ");
}
return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};
const normalizeInternship = (item: any): Internship => ({
...item,
company: cleanDisplayText(item.company ?? item.company_name ?? item.employer ?? item.organization),
role: cleanDisplayText(item.role ?? item.title ?? item.job_title ?? item.position ?? item.internship_title),
location: cleanDisplayText(item.location ?? item.city ?? item.work_location),
category: cleanDisplayText(item.category ?? item.department),
applyLink: item.apply_link ?? item.applyLink ?? item.application_url,
type: cleanDisplayText(item.work_type ?? item.type ?? item.employment_type),
postedDate: item.postedDate ?? item.posted_date,
deadline: item.deadline ?? item.application_deadline,
});
// Extract URL from normal or Markdown links
const getApplicationLink = (internship: Internship) => {
let link = String(
internship.applyLink || internship.apply_link || ""
).trim();
const markdownMatch = link.match(/\]\((https?:\/\/[^)]+)\)/i);
if (markdownMatch) link = markdownMatch[1];
return /^https?:\/\//i.test(link) ? link : "";
};
// Use the application site's favicon as a best-effort company logo.
// ATS-hosted application links are skipped because their favicon is not the employer's.
const getCompanyLogo = (internship: Internship) => {
  const link = getApplicationLink(internship);
  if (!link) return "";
  try {
    const hostname = new URL(link).hostname.replace(/^www\./i, "");
    const atsHosts = [
      "greenhouse.io",
      "lever.co",
      "workdayjobs.com",
      "myworkdayjobs.com",
      "smartrecruiters.com",
      "ashbyhq.com",
      "workable.com",
      "wellfound.com",
      "linkedin.com",
      "internshala.com",
      "unstop.com",
      "indeed.com",
    ];
    if (atsHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
      return "";
    }
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
  } catch {
    return "";
  }
};
const getDate = (value?: string) => {
if (!value) return null;
const date = new Date(value);
return Number.isNaN(date.getTime()) ? null : date;
};
const getStipendValue = (value?: string | number) => {
if (value === undefined || value === null) return 0;
const parsed = Number(
String(value).replace(/[^0-9.]/g, "")
);
return Number.isFinite(parsed) ? parsed : 0;
};
const getSkills = (skills?: string[] | string) => {
if (Array.isArray(skills)) return skills;
if (typeof skills === "string") {
return skills
.split(",")
.map((skill) => skill.trim())
.filter(Boolean);
}
return [];
};
// Fetch internship list
useEffect(() => {
const fetchInternships = async () => {
setLoading(true);
try {
const response = await fetch(`${API_URL}/internships`);
if (!response.ok) {
throw new Error("Failed to fetch internships");
}
const result = await response.json();
const validInternships = result
.map(normalizeInternship)
.filter((item: Internship) =>
Boolean(getApplicationLink(item))
);
setInternships(validInternships);
} catch (error) {
console.error("Internship fetch error:", error);
setInternships([]);
} finally {
setLoading(false);
}
};
fetchInternships();
}, []);
// Fetch saved internships
useEffect(() => {
const fetchSaved = async () => {
const token = localStorage.getItem("token");
if (!token || token === "temp") return;
try {
const response = await fetch(`${API_URL}/saved`, {
headers: {
Authorization: `Bearer ${token}`,
},
});
if (!response.ok) return;
const result = await response.json();
const ids = Array.isArray(result)
? result.map((item: any) =>
Number(item.id ?? item.internship_id)
)
: [];
setSavedIds(ids.filter(Number.isFinite));
} catch (error) {
console.error("Saved internships error:", error);
}
};
fetchSaved();
}, []);
// Close filter dropdown when clicking outside
useEffect(() => {
const handleClickOutside = (event: MouseEvent) => {
if (
filterRef.current &&
!filterRef.current.contains(event.target as Node)
) {
setActiveFilter(null);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => {
document.removeEventListener("mousedown", handleClickOutside);
};
}, []);
// Lock background scrolling while mobile details are open
useEffect(() => {
if (!mobileDetailsOpen) return;
const previousOverflow = document.body.style.overflow;
document.body.style.overflow = "hidden";
return () => {
document.body.style.overflow = previousOverflow;
};
}, [mobileDetailsOpen]);
// Available filter options
const locations = useMemo(
() => [
"All locations",
...Array.from(
new Set(
internships
.map((item) => item.location)
.filter(Boolean)
)
).sort(),
],
[internships]
);
const companies = useMemo(
() => [
"All companies",
...Array.from(
new Set(
internships
.map((item) => item.company)
.filter(Boolean)
)
).sort(),
],
[internships]
);
const types = useMemo(
() => [
"All types",
...Array.from(
new Set(
internships
.map((item) => item.type || item.work_type)
.filter(Boolean) as string[]
)
).sort(),
],
[internships]
);
const categories = useMemo(
() => [
"All categories",
...Array.from(
new Set(
internships
.map((item) => item.category)
.filter(Boolean) as string[]
)
).sort(),
],
[internships]
);
const experienceLevels = useMemo(
() => [
"All levels",
...Array.from(
new Set(
internships
.map((item) => item.experience_level)
.filter(Boolean) as string[]
)
).sort(),
],
[internships]
);
// Filter and sort internships
const filteredInternships = useMemo(() => {
const query = searchQuery.toLowerCase().trim();
let result = internships.filter((item) => {
const searchable = [
item.role,
item.company,
item.location,
item.category,
item.type,
item.skills,
]
.flat()
.filter(Boolean)
.join(" ")
.toLowerCase();
if (query && !searchable.includes(query)) return false;
if (
locationFilter !== "All locations" &&
item.location !== locationFilter
) {
return false;
}
if (
companyFilter !== "All companies" &&
item.company !== companyFilter
) {
return false;
}
if (
typeFilter !== "All types" &&
(item.type || item.work_type) !== typeFilter
) {
return false;
}
if (
categoryFilter !== "All categories" &&
item.category !== categoryFilter
) {
return false;
}
if (
experienceFilter !== "All levels" &&
item.experience_level !== experienceFilter
) {
return false;
}
if (remoteOnly) {
const type = (
item.type ||
item.work_type ||
""
).toLowerCase();
if (!type.includes("remote")) return false;
}
if (savedOnly && !savedIds.includes(Number(item.id))) {
return false;
}
return true;
});
result = [...result].sort((a, b) => {
if (sortOption === "latest" || sortOption === "oldest") {
const dateA =
getDate(a.postedDate || a.posted_date)?.getTime() || 0;
const dateB =
getDate(b.postedDate || b.posted_date)?.getTime() || 0;
return sortOption === "latest"
? dateB - dateA
: dateA - dateB;
}
if (sortOption === "stipend") {
return (
getStipendValue(b.stipend) -
getStipendValue(a.stipend)
);
}
if (sortOption === "deadline") {
const dateA = getDate(a.deadline)?.getTime();
const dateB = getDate(b.deadline)?.getTime();
if (!dateA) return 1;
if (!dateB) return -1;
return dateA - dateB;
}
return 0;
});
return result;
}, [
internships,
searchQuery,
locationFilter,
companyFilter,
typeFilter,
categoryFilter,
experienceFilter,
remoteOnly,
savedOnly,
savedIds,
sortOption,
]);
// Load details. recordView is true only for an intentional user click.
const loadInternshipDetails = async (
internship: Internship,
recordView: boolean
) => {
const currentRequest = ++requestIdRef.current;
setSelectedInternship(internship);
setDetailLoading(true);
setDetailError("");
setApplyMessage("");
try {
const response = await fetch(
`${API_URL}/internships/${internship.id}`
);
const result = await response.json();
if (!response.ok) {
throw new Error(
result.message || "Could not load internship details."
);
}
if (currentRequest !== requestIdRef.current) return;
setSelectedInternship(normalizeInternship(result));
// Only intentional selections are recorded in Recently Viewed.
if (recordView) {
const token = localStorage.getItem("token");
if (token && token !== "temp") {
const viewResponse = await fetch(
`${API_URL}/recently-viewed/${internship.id}`,
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
"Recently Viewed update failed:",
viewResponse.status
);
}
}
}
} catch (error) {
if (currentRequest !== requestIdRef.current) return;
setDetailError(
error instanceof Error
? error.message
: "Unable to load internship details."
);
} finally {
if (currentRequest === requestIdRef.current) {
setDetailLoading(false);
}
}
};
// Automatically preview the first result whenever the result set changes.
// This does not record an automatic preview as Recently Viewed.
useEffect(() => {
if (loading) return;
if (filteredInternships.length === 0) {
requestIdRef.current += 1;
setSelectedInternship(null);
setDetailLoading(false);
setDetailError("");
setMobileDetailsOpen(false);
return;
}
const firstInternship = filteredInternships[0];
loadInternshipDetails(firstInternship, false);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [filteredInternships, loading]);
// Intentional selection by user
const handleSelectInternship = (internship: Internship) => {
setMobileDetailsOpen(true);
loadInternshipDetails(internship, true);
};
// Close details panel
const closeDetails = () => {
requestIdRef.current += 1;
setMobileDetailsOpen(false);
setDetailLoading(false);
setDetailError("");
setApplyMessage("");
// Keep the selected preview on desktop.
// The mobile full-screen view closes and reveals the list.
};
// Save or unsave internship
const handleSave = async (
event: React.MouseEvent,
internship: Internship
) => {
event.stopPropagation();
const token = localStorage.getItem("token");
if (!token || token === "temp") {
alert("Please log in to save internships.");
return;
}
const id = Number(internship.id);
const isSaved = savedIds.includes(id);
setSavingIds((previous) => [...previous, id]);
try {
const response = await fetch(`${API_URL}/saved/${id}`, {
method: isSaved ? "DELETE" : "POST",
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "application/json",
},
});
if (!response.ok) {
throw new Error("Could not update saved internship.");
}
setSavedIds((previous) =>
isSaved
? previous.filter((savedId) => savedId !== id)
: [...previous, id]
);
} catch (error) {
console.error("Save internship error:", error);
alert("Unable to update saved internship. Please try again.");
} finally {
setSavingIds((previous) =>
previous.filter((savedId) => savedId !== id)
);
}
};
// Apply to selected internship
const handleApply = () => {
if (!selectedInternship) return;
const link = getApplicationLink(selectedInternship);
if (!link) {
setApplyMessage("Application link is unavailable.");
return;
}
window.open(link, "_blank", "noopener,noreferrer");
setApplyMessage("");
};
// Reset filters
const resetFilters = () => {
setLocationFilter("All locations");
setCompanyFilter("All companies");
setTypeFilter("All types");
setCategoryFilter("All categories");
setExperienceFilter("All levels");
setRemoteOnly(false);
setSavedOnly(false);
setSearchQuery("");
setSortOption("latest");
setActiveFilter(null);
};
const activeFilterCount = [
locationFilter !== "All locations",
companyFilter !== "All companies",
typeFilter !== "All types",
categoryFilter !== "All categories",
experienceFilter !== "All levels",
remoteOnly,
savedOnly,
].filter(Boolean).length;
const skills = getSkills(selectedInternship?.skills);
const filterOptions: Record<FilterName, string[]> = {
location: locations,
company: companies,
type: types,
category: categories,
experience: experienceLevels,
};
const filterValues: Record<FilterName, string> = {
location: locationFilter,
company: companyFilter,
type: typeFilter,
category: categoryFilter,
experience: experienceFilter,
};
const filterSetters: Record<
FilterName,
(value: string) => void
> = {
location: setLocationFilter,
company: setCompanyFilter,
type: setTypeFilter,
category: setCategoryFilter,
experience: setExperienceFilter,
};
const filterLabels: Record<FilterName, string> = {
location: "Location",
company: "Company",
type: "Employment type",
category: "Category",
experience: "Experience level",
};
const filterDefaults: Record<FilterName, string> = {
location: "All locations",
company: "All companies",
type: "All types",
category: "All categories",
experience: "All levels",
};
const FilterChip = ({ name }: { name: FilterName }) => (
<div className="relative shrink-0">
<button
type="button"
onClick={() =>
setActiveFilter(activeFilter === name ? null : name)
}
className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${
activeFilter === name ||
filterValues[name] !== filterDefaults[name]
? "border-neutral-400 dark:border-white/40 bg-neutral-900/10 text-neutral-800 dark:bg-white/10 dark:text-neutral-100"
: "border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]"
}`}
>
{filterValues[name] === filterDefaults[name]
? filterLabels[name]
: filterValues[name]}
<ChevronDown className="w-3.5 h-3.5" />
</button>
{activeFilter === name && (
<div className="absolute top-full left-0 mt-2 z-50 w-64 max-h-72 overflow-y-auto rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] shadow-xl p-2">
{filterOptions[name].map((option) => (
<button
type="button"
key={option}
onClick={() => {
filterSetters[name](option);
setActiveFilter(null);
}}
className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm hover:bg-neutral-100/80 dark:hover:bg-white/[0.08] transition-colors"
>
<span>{option}</span>
{filterValues[name] === option && (
<Check className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
)}
</button>
))}
</div>
)}
</div>
);
return (
<div className="min-h-screen bg-white dark:bg-black text-neutral-950 dark:text-neutral-100 font-['Inter']">
<Navbar
searchQuery={searchQuery}
onSearchChange={setSearchQuery}
isDark={isDark}
toggleTheme={toggleTheme}
/>
{/* SEARCH AND FILTER BAR */}
<section className="pt-24 md:pt-28 px-4 md:px-8 pb-5 border-b border-black/10 dark:border-white/15">
<div
ref={filterRef}
className="max-w-6xl mx-auto"
>
<div className="flex flex-col sm:flex-row gap-3 mb-4">
<div className="relative flex-1">
<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 dark:text-neutral-400" />
<input
type="text"
placeholder="Search for roles, companies, skills..."
value={searchQuery}
onChange={(event) =>
setSearchQuery(event.target.value)
}
className="w-full h-12 pl-12 pr-4 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] backdrop-blur-2xl outline-none text-sm focus:border-neutral-500 dark:focus:border-white/40 transition-colors"
/>
</div>
<button
type="button"
onClick={() => setShowFilters((previous) => !previous)}
className="h-12 px-5 flex items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] backdrop-blur-2xl hover:bg-neutral-100/80 dark:hover:bg-white/[0.12] text-sm font-semibold whitespace-nowrap transition-colors"
>
<SlidersHorizontal className="w-4 h-4" />
Filters
{activeFilterCount > 0 && (
<span className="bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-full w-5 h-5 flex items-center justify-center text-xs">
{activeFilterCount}
</span>
)}
</button>
</div>
{showFilters && (
<div className="mt-3 rounded-2xl border border-black/10 dark:border-white/15 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-2xl shadow-xl p-3">
<div className="flex flex-wrap items-center gap-2">
<FilterChip name="location" />
<FilterChip name="company" />
<FilterChip name="type" />
<FilterChip name="experience" />
<FilterChip name="category" />
<button type="button" onClick={() => setRemoteOnly((value) => !value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${remoteOnly ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white" : "border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] hover:bg-neutral-100 dark:hover:bg-white/[0.12]"}`}>
<Wifi className="w-3.5 h-3.5" />Remote{remoteOnly && <Check className="w-3.5 h-3.5" />}
</button>
<button type="button" onClick={() => setSavedOnly((value) => !value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors ${savedOnly ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white" : "border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.06] hover:bg-neutral-100 dark:hover:bg-white/[0.12]"}`}>
<Bookmark className="w-3.5 h-3.5" />Saved{savedOnly && <Check className="w-3.5 h-3.5" />}
</button>
<button type="button" onClick={resetFilters} className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-full">Reset</button>
</div>
</div>
)}</div>
</section>
{/* RESULTS HEADER */}
<section className="max-w-6xl mx-auto px-4 md:px-8 pt-5 pb-3">
<div className="flex items-center justify-between gap-3">
<div className="flex items-center gap-4">
<span className="text-sm text-neutral-500 dark:text-neutral-400">
{filteredInternships.length} results
</span>
<span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
<MapPin className="w-4 h-4" />
All locations
</span>
</div>
<div className="relative">
<button
type="button"
onClick={() =>
setShowSortOptions(!showSortOptions)
}
className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:text-neutral-100"
>
Sort:
<span className="font-semibold text-neutral-950 dark:text-neutral-100">
{sortOption === "latest"
? "Latest"
: sortOption === "oldest"
? "Oldest"
: sortOption === "stipend"
? "Highest stipend"
: "Deadline"}
</span>
<ChevronDown className="w-4 h-4" />
</button>
{showSortOptions && (
<div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] shadow-xl p-2">
{[
["latest", "Latest"],
["oldest", "Oldest"],
["stipend", "Highest stipend"],
["deadline", "Deadline"],
].map(([value, label]) => (
<button
key={value}
type="button"
onClick={() => {
setSortOption(value);
setShowSortOptions(false);
}}
className="w-full text-left px-3 py-2.5 rounded-lg text-sm hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]"
>
{label}
</button>
))}
</div>
)}
</div>
</div>
</section>
{/* LINKEDIN-STYLE TWO-PANEL WORKSPACE */}
<main className="max-w-6xl mx-auto px-3 md:px-8 pb-6">
<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] gap-3 lg:h-[calc(100vh-245px)] lg:min-h-[560px]">
{/* LEFT: INTERNSHIP RESULTS */}
<section
className={`min-w-0 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] overflow-y-auto hide-scrollbar ${
mobileDetailsOpen ? "hidden lg:block" : "block"
}`}
>
{loading ? (
<div className="p-4 space-y-4">
<div className="h-5 w-32 rounded bg-secondary animate-pulse" />
{Array.from({ length: 5 }).map((_, index) => (
<div
key={index}
className="h-32 rounded-xl bg-secondary/60 animate-pulse"
/>
))}
</div>
) : filteredInternships.length === 0 ? (
<div className="p-8 text-center">
<Search className="w-9 h-9 mx-auto mb-3 text-neutral-500 dark:text-neutral-400" />
<h3 className="font-semibold mb-2">
No internships found
</h3>
<p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
Try changing your search or filters.
</p>
<button
type="button"
onClick={resetFilters}
className="text-sm text-neutral-800 dark:text-neutral-200 font-semibold"
>
Clear filters
</button>
</div>
) : (
<div>
{filteredInternships.map((internship) => {
const isSelected =
selectedInternship?.id === internship.id;
const isSaved = savedIds.includes(
Number(internship.id)
);
const isSaving = savingIds.includes(
Number(internship.id)
);
return (
<div
key={internship.id}
role="button"
tabIndex={0}
onClick={() =>
handleSelectInternship(internship)
}
onKeyDown={(event) => {
if (
event.key === "Enter" ||
event.key === " "
) {
event.preventDefault();
handleSelectInternship(internship);
}
}}
className={`w-full text-left p-4 border-b border-black/10 dark:border-white/15 cursor-pointer transition-colors ${
isSelected
? "bg-neutral-100/80 dark:bg-neutral-800/60"
: "hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]/50"
}`}
>
<div className="flex items-start gap-3">
<div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-white/[0.08] flex items-center justify-center shrink-0">
<Building2 className="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
</div>
<div className="flex-1 min-w-0">
<h3
className={`font-semibold text-[15px] leading-5 line-clamp-2 ${
isSelected
? "text-neutral-800 dark:text-neutral-200"
: "text-neutral-950 dark:text-neutral-100"
}`}
>
{internship.role}
</h3>
<p className="text-sm mt-1 text-neutral-950 dark:text-neutral-100">
{internship.company}
</p>
<p className="text-sm mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-1">
{internship.location ||
"Location not specified"}
</p>
<div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
{internship.type && (
<span>{internship.type}</span>
)}
{internship.stipend && (
<>
<span>·</span>
<span>{internship.stipend}</span>
</>
)}
</div>
{internship.postedDate && (
<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
Posted {internship.postedDate}
</p>
)}
</div>
<button
type="button"
disabled={isSaving}
onClick={(event) =>
handleSave(event, internship)
}
className={`p-2 rounded-full border border-black/10 dark:border-white/15 shrink-0 transition-colors ${
isSaved
? "text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/60"
: "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]"
}`}
aria-label={
isSaved
? "Remove saved internship"
: "Save internship"
}
>
<Bookmark
className="w-4 h-4"
fill={isSaved ? "currentColor" : "none"}
/>
</button>
</div>
{isSelected && (
<div className="mt-3 h-0.5 bg-primary rounded-full" />
)}
</div>
);
})}
</div>
)}
</section>
{/* RIGHT: DETAILS PREVIEW */}
<AnimatePresence mode="wait">
{selectedInternship ? (
<motion.section
key={selectedInternship.id}
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.18 }}
className={`
fixed inset-0 z-[100] bg-white dark:bg-black
h-[100dvh] overflow-y-auto
${mobileDetailsOpen ? "block" : "hidden"}
lg:block lg:relative lg:inset-auto lg:z-auto
lg:h-full lg:max-h-full
lg:rounded-xl lg:border lg:border-black/10 dark:border-white/15
lg:bg-white/70 dark:bg-white/[0.055] lg:shadow-sm
hide-scrollbar
`}
>
{/* MOBILE HEADER */}
<div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/15 bg-white dark:bg-black/95 backdrop-blur-md lg:hidden">
<button
type="button"
onClick={closeDetails}
className="p-2 -ml-2 rounded-full hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]"
aria-label="Close details"
>
<ArrowLeft className="w-5 h-5" />
</button>
<span className="font-semibold text-sm">
Internship Details
</span>
</div>
<div className="p-5 md:p-7">
{/* DETAILS HEADER */}
<div className="flex items-start justify-between gap-4 mb-5">
<div className="min-w-0">
<p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
{selectedInternship.company}
</p>
<h1 className="text-2xl md:text-3xl font-semibold leading-tight break-words">
{selectedInternship.role}
</h1>
<div className="flex flex-wrap gap-x-2 gap-y-1 mt-3 text-sm text-neutral-500 dark:text-neutral-400">
<span>
{selectedInternship.location}
</span>
<span>·</span>
<span>
{selectedInternship.type ||
selectedInternship.work_type ||
"Type not specified"}
</span>
</div>
</div>
<button
type="button"
onClick={closeDetails}
className="hidden lg:flex p-2 rounded-full hover:bg-neutral-100/80 dark:hover:bg-white/[0.08]"
aria-label="Close details"
>
<X className="w-5 h-5" />
</button>
</div>
{/* JOB TAGS */}
<div className="flex flex-wrap gap-2 mb-5">
{selectedInternship.category && (
<span className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 text-sm">
{selectedInternship.category}
</span>
)}
{selectedInternship.stipend && (
<span className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 text-sm">
{selectedInternship.stipend}
</span>
)}
{selectedInternship.experience_level && (
<span className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/15 text-sm">
{selectedInternship.experience_level}
</span>
)}
</div>
{/* APPLY AND SAVE */}
<div className="flex items-center gap-3 mb-7">
<button
type="button"
onClick={handleApply}
disabled={detailLoading}
className="px-5 py-2.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
>
Apply
<ExternalLink className="w-4 h-4" />
</button>
<button
type="button"
onClick={(event) =>
handleSave(event, selectedInternship)
}
className={`px-5 py-2.5 rounded-full border border-neutral-400 dark:border-white/40 font-semibold text-sm flex items-center gap-2 ${
savedIds.includes(Number(selectedInternship.id))
? "bg-neutral-900/10 text-neutral-800 dark:bg-white/10 dark:text-neutral-100"
: "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-950 dark:bg-white/5"
}`}
>
<Bookmark className="w-4 h-4" />
{savedIds.includes(Number(selectedInternship.id))
? "Saved"
: "Save"}
</button>
</div>
{applyMessage && (
<p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
{applyMessage}
</p>
)}
{detailLoading ? (
<div className="py-12 space-y-4">
<div className="h-5 w-40 rounded bg-secondary animate-pulse" />
<div className="h-4 w-full rounded bg-secondary animate-pulse" />
<div className="h-4 w-5/6 rounded bg-secondary animate-pulse" />
<div className="h-4 w-4/6 rounded bg-secondary animate-pulse" />
</div>
) : detailError ? (
<div className="p-5 rounded-xl bg-destructive/10 text-destructive text-sm">
{detailError}
</div>
) : (
<>
{/* ABOUT */}
<div className="border-t border-black/10 dark:border-white/15 pt-6 pb-7">
<h2 className="text-xl font-semibold mb-4">
About the Role
</h2>
<p className="text-sm leading-7 text-neutral-500 dark:text-neutral-400 whitespace-pre-line">
{cleanDisplayText(selectedInternship.description) ||
"No description available for this position."}
</p>
</div>
{/* SKILLS */}
<div className="border-t border-black/10 dark:border-white/15 pt-6 pb-7">
<h2 className="text-xl font-semibold mb-4">
Required Skills
</h2>
{skills.length > 0 ? (
<div className="flex flex-wrap gap-2">
{skills.map((skill, index) => (
<span
key={index}
className="px-3 py-2 rounded-full bg-secondary text-sm"
>
{skill}
</span>
))}
</div>
) : (
<p className="text-sm text-neutral-500 dark:text-neutral-400">
No specific skills listed.
</p>
)}
</div>
{/* ADDITIONAL INFORMATION */}
<div className="border-t border-black/10 dark:border-white/15 pt-6 pb-7">
<h2 className="text-xl font-semibold mb-4">
Internship Information
</h2>
<div className="space-y-4 text-sm">
<div className="flex items-start gap-3">
<Building2 className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400" />
<div>
<p className="font-medium">Company</p>
<p className="text-neutral-500 dark:text-neutral-400">
{selectedInternship.company}
</p>
</div>
</div>
<div className="flex items-start gap-3">
<MapPin className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400" />
<div>
<p className="font-medium">Location</p>
<p className="text-neutral-500 dark:text-neutral-400">
{selectedInternship.location}
</p>
</div>
</div>
<div className="flex items-start gap-3">
<Briefcase className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400" />
<div>
<p className="font-medium">Work type</p>
<p className="text-neutral-500 dark:text-neutral-400">
{selectedInternship.type ||
"Not specified"}
</p>
</div>
</div>
{[
  ["Experience", selectedInternship.experience || selectedInternship.experience_level],
  ["Degree", selectedInternship.degree],
  ["Salary", selectedInternship.salary],
  ["Duration", selectedInternship.duration],
  ["Eligible batch", selectedInternship.batch],
].filter(([, value]) => value !== undefined && value !== null && value !== "").map(([label, value]) => (
  <div key={label as string} className="flex items-start gap-3">
    <div className="w-4 h-4 mt-0.5 shrink-0" />
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-neutral-500 dark:text-neutral-400">{value}</p>
    </div>
  </div>
))}
{selectedInternship.postedDate && (
<div className="flex items-start gap-3">
<Clock className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400" />
<div>
<p className="font-medium">Posted</p>
<p className="text-neutral-500 dark:text-neutral-400">
{selectedInternship.postedDate}
</p>
</div>
</div>
)}
{selectedInternship.deadline && (
<div className="flex items-start gap-3">
<CalendarDays className="w-4 h-4 mt-0.5 text-neutral-500 dark:text-neutral-400" />
<div>
<p className="font-medium">
Application deadline
</p>
<p className="text-neutral-500 dark:text-neutral-400">
{selectedInternship.deadline}
</p>
</div>
</div>
)}
</div>
</div>
{/* BOTTOM APPLY BUTTON */}
<div className="border-t border-black/10 dark:border-white/15 pt-6 pb-4">
<button
type="button"
onClick={handleApply}
className="w-full sm:w-auto px-7 py-3 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold text-sm flex items-center justify-center gap-2"
>
Apply Now
<ExternalLink className="w-4 h-4" />
</button>
</div>
</>
)}
</div>
</motion.section>
) : (
<div className="hidden lg:flex rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/[0.055] items-center justify-center p-10 text-center">
<div className="max-w-xs">
<LayoutGrid className="w-10 h-10 mx-auto mb-4 text-neutral-500 dark:text-neutral-400" />
<h2 className="text-lg font-semibold mb-2">
Select an internship
</h2>
<p className="text-sm text-neutral-500 dark:text-neutral-400">
Choose an opportunity from the list to view its details here.
</p>
</div>
</div>
)}
</AnimatePresence>
</div>
</main>
<style>{`
.hide-scrollbar::-webkit-scrollbar {
display: none;
}
.hide-scrollbar {
-ms-overflow-style: none;
scrollbar-width: none;
}
`}</style>
</div>
);
};
export default Internships;
