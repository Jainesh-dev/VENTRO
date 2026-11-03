import React from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { locations as defaultLocations, companies as defaultCompanies, categories as defaultCategories, workTypes as defaultWorkTypes } from "@/data/internships";
export interface Filters {
  location: string;
  company: string;
  category: string;
  workType: string;
}
interface FilterPanelProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  locations?: string[];
  companies?: string[];
  categories?: string[];
  workTypes?: string[];
}
const SelectFilter = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-['Sora']">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl bg-secondary/70 text-foreground text-sm px-3.5 py-3 pr-10 border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 appearance-none cursor-pointer transition-all shadow-sm"
      >
        <option value="">All {label.toLowerCase()}s</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-card text-foreground">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  </div>
);
const FilterPanel = ({
  filters,
  onChange,
  mobileOpen,
  onToggleMobile,
  locations = defaultLocations,
  companies = defaultCompanies,
  categories = defaultCategories,
  workTypes = defaultWorkTypes,
}: FilterPanelProps) => {
  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });
  const activeCount = Object.values(filters).filter(Boolean).length;
  const clearAll = () =>
    onChange({ location: "", company: "", category: "", workType: "" });
  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 font-['Sora']">
          <Filter className="h-4 w-4 text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Reset All
          </button>
        )}
      </div>
      <div className="space-y-4">
        <SelectFilter label="Location" value={filters.location} options={locations} onChange={(value) => update("location", value)} />
        <SelectFilter label="Company" value={filters.company} options={companies} onChange={(value) => update("company", value)} />
        <SelectFilter label="Category" value={filters.category} options={categories} onChange={(value) => update("category", value)} />
        <SelectFilter label="Work Type" value={filters.workType} options={workTypes} onChange={(value) => update("workType", value)} />
      </div>
    </div>
  );
  return (
    <>
      <button
        type="button"
        onClick={onToggleMobile}
        className="lg:hidden flex items-center gap-2 text-sm font-semibold text-foreground bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 mb-6 hover:border-primary/40 transition-all shadow-sm"
        aria-expanded={mobileOpen}
      >
        <Filter className="h-4 w-4 text-primary" />
        <span>Filter Internships</span>
        {activeCount > 0 && (
          <span className="bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">
            {activeCount}
          </span>
        )}
      </button>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
          onClick={onToggleMobile}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-full bg-card/95 backdrop-blur-2xl p-6 shadow-2xl border-l border-border overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-foreground font-['Sora'] text-lg">Filter Options</span>
              <button
                type="button"
                onClick={onToggleMobile}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 bg-card/70 backdrop-blur-2xl rounded-3xl border border-border p-6 shadow-sm">
          {content}
        </div>
      </aside>
    </>
  );
};
export default FilterPanel;
