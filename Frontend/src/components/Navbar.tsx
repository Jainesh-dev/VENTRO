
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sun,
  Moon,
  Bell,
  User,
  Bookmark,
  LayoutDashboard,
  History,
  Upload,
  LogOut,
  X,
  Home,
  Compass,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/authcontext";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar = ({
  isDark,
  toggleTheme,
  searchQuery,
  onSearchChange,
}: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internships, setInternships] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setOpenProfile(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Theme-aware VENTRO browser favicon.
  useEffect(() => {
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
      ?.setAttribute("content", isDark ? "#101010" : "#ffffff");
  }, [isDark]);

  useEffect(() => {
    let cancelled = false;
    const fetchInternships = async () => {
      try {
        const response = await fetch(`${API_URL}/internships`);
        if (!response.ok) throw new Error("Could not load internship search results.");
        const payload = await response.json();
        const records = Array.isArray(payload) ? payload : Array.isArray(payload.internships) ? payload.internships : Array.isArray(payload.data) ? payload.data : [];
        if (!cancelled) setInternships(records.filter((item: any) => item?.id != null));
      } catch (error) {
        console.error("Navbar internship search error:", error);
        if (!cancelled) setInternships([]);
      }
    };
    fetchInternships();
    return () => { cancelled = true; };
  }, []);

  const filteredInternships = internships
    .filter((internship) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return [internship.company, internship.role, internship.category, internship.location]
        .some((value) => String(value || "").toLowerCase().includes(query));
    })
    .slice(0, 8);

  const navigateTo = (path: string) => {
    navigate(path);
    setOpenProfile(false);
    setMobileMenuOpen(false);
  };

  const openInternship = (id: string | number) => {
    if (id === undefined || id === null || String(id).trim() === "") return;
    setIsSearchOpen(false);
    onSearchChange("");
    navigate(`/internship/${encodeURIComponent(String(id))}`);
  };

  const handleResumeUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        localStorage.setItem("resume", reader.result);
        setOpenProfile(false);
      }
    };

    reader.onerror = () => {
      alert("Unable to read this file. Please try again.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/auth");
  };

  const navItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Discover", path: "/internships", icon: Compass },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  const isActive = (path: string) => location.pathname === path;

  const iconButtonClass =
    "w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors";

  return (
    <>
      {/* GLOBAL SEARCH */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex justify-center items-start pt-[12vh] px-4">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="relative w-full max-w-xl max-h-[75vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-3 px-4">
              <Search className="h-5 w-5 text-primary shrink-0" />

              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                placeholder="Search internships, companies, or roles..."
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full py-4 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground"
              />

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-secondary"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-t border-border" />

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship) => (
                  <button
                    key={internship.id}
                    type="button"
                    onClick={() => openInternship(internship.id)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-primary/10 group transition-colors"
                  >
                    <div className="font-semibold text-foreground group-hover:text-primary">
                      {internship.company}
                    </div>

                    <div className="text-sm text-muted-foreground mt-0.5">
                      {internship.role}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-10 text-center">
                  <Search className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />

                  <p className="text-sm font-medium">
                    No results found
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Try another company or role.
                  </p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border flex justify-between">
              <span className="text-xs text-muted-foreground">
                VENTRO Search
              </span>

              <span className="text-xs text-muted-foreground">
                Press ESC to close
              </span>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-background border-b border-border/60"
        }`}
      >
        <div className="w-[calc(100%-2rem)] max-w-[1256px] mx-auto h-[76px] grid grid-cols-[1fr_auto_1fr] items-center gap-3">

          {/* VENTRO BRAND */}
          <button
            type="button"
            onClick={() => navigateTo("/home")}
            className="flex items-center gap-3 justify-self-start shrink-0"
            aria-label="Go to VENTRO home"
          >
            <div className="w-11 h-11 flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105">
              <img
                src={
                  isDark
                    ? "/ventro-logo-dark.png"
                    : "/ventro-logo-light.png"
                }
                alt="VENTRO logo"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="font-semibold text-xl tracking-[0.18em] text-foreground whitespace-nowrap font-['Sora']">
              VENTRO
            </span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigateTo(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}

                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center justify-self-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={iconButtonClass}
              aria-label="Search internships"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              className={`${iconButtonClass} hidden sm:flex`}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={iconButtonClass}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>

            {/* PROFILE MENU */}
            <div className="relative ml-1" ref={profileRef}>
              <button
                type="button"
                onClick={() => setOpenProfile((previous) => !previous)}
                className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors ${
                  openProfile
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/60 text-foreground hover:bg-secondary"
                }`}
                aria-label="Open profile menu"
                aria-expanded={openProfile}
              >
                <User className="w-4 h-4" />
              </button>

              <div
                className={`absolute top-[calc(100%+12px)] right-0 w-60 rounded-2xl p-2 z-50 border border-border bg-card shadow-2xl transition-all duration-200 origin-top-right ${
                  openProfile
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                }`}
              >
                <div className="px-4 py-3">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                    Account
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    Your Workspace
                  </p>
                </div>

                <div className="border-t border-border mb-2" />

                <button
                  type="button"
                  onClick={() => navigateTo("/saved")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  Saved Internships
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo("/history")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <History className="w-4 h-4" />
                  Recently Viewed
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Resume Vault
                </button>

                <input
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                <div className="border-t border-border my-2" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((previous) => !previous)
              }
              className={`${iconButtonClass} md:hidden`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen
              ? "max-h-64 opacity-100 border-t border-border"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="w-[calc(100%-2rem)] max-w-[1256px] mx-auto py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigateTo(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
  