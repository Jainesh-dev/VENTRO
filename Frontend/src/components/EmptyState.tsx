import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  onClear: () => void;
  title?: string;
  description?: string;
}

const EmptyState = ({ 
  onClear, 
  title = "No internships found", 
  description = "Try adjusting your filters or search query to find what you're looking for." 
}: EmptyStateProps) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="w-16 h-16 rounded-3xl bg-card/80 border border-border flex items-center justify-center mb-4 shadow-sm backdrop-blur-xl">
      <SearchX className="h-7 w-7 text-muted-foreground" />
    </div>
    <h3 className="font-semibold text-lg text-foreground mb-1.5 font-['Sora']">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
      {description}
    </p>
    <button 
      onClick={onClear} 
      className="px-5 py-2.5 rounded-2xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-secondary/80 transition-all shadow-sm active:scale-95"
    >
      Clear all filters
    </button>
  </div>
);

export default EmptyState;