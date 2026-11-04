import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Building, Sparkles } from "lucide-react";

export interface RecommendedInternship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
}

interface RecommendationCardProps {
  internship: RecommendedInternship;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ internship }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="relative flex h-full min-h-0 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-2xl transition-all duration-300 hover:border-foreground/20 hover:shadow-lg sm:p-5"
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
              {internship.company}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-foreground" />
            <span className="text-[10px] font-semibold text-foreground sm:text-xs">
              {internship.matchScore}% Match
            </span>
          </div>
        </div>

        <h3 className="line-clamp-2 font-['Sora'] text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
          {internship.title}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate text-xs text-muted-foreground">
            {internship.location}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[10px] font-medium text-foreground">
            {internship.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;