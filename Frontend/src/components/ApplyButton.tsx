import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface Props {
  id: string | number;
}

const ApplyButton = ({ id }: Props) => {
  const [applied, setApplied] = useState(false);
  const stringId = String(id);

  // 🔄 Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applied") || "[]");
    const isApplied = stored.some((item: any) => 
      typeof item === "object" ? String(item.id) === stringId : String(item) === stringId
    );
    if (isApplied) {
      setApplied(true);
    }
  }, [stringId]);

  // 🚀 Handle Apply
  const handleApply = () => {
    const stored = JSON.parse(localStorage.getItem("applied") || "[]");
    const isAlreadyApplied = stored.some((item: any) => 
      typeof item === "object" ? String(item.id) === stringId : String(item) === stringId
    );

    if (!isAlreadyApplied) {
      const updated = [...stored, { id: stringId, date: new Date().toISOString() }];
      localStorage.setItem("applied", JSON.stringify(updated));
      setApplied(true);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={applied}
      className={`w-full rounded-2xl py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] shadow-sm ${
        applied
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
          : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
      }`}
    >
      {applied ? "Applied ✓" : "Apply Now"}
      {!applied && <ExternalLink className="h-4 w-4" />}
    </button>
  );
};

export default ApplyButton;