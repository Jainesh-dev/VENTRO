import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building, Sparkles } from 'lucide-react';

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
      whileHover={{ y: -4, scale: 1.01 }}
      className="p-6 rounded-3xl border border-border bg-card/60 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Absolute badge container */}
      <div className="absolute top-0 right-0 bg-primary/10 border-l border-b border-border px-3 py-1.5 rounded-bl-2xl flex items-center gap-1.5 backdrop-blur-xl">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary">{internship.matchScore}% Match</span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{internship.company}</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-4 tracking-tight font-['Sora']">{internship.title}</h3>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-muted-foreground/80" />
          <span>{internship.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-muted-foreground/80" />
          <span className="px-2.5 py-1 rounded-full bg-muted/60 border border-border text-xs text-foreground font-medium">
            {internship.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;