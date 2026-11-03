import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";

interface Props {
  id: string | number;
}

const SaveButton = ({ id }: Props) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const stringId = String(id);

  useEffect(() => {
    const stored: string[] = JSON.parse(
      localStorage.getItem("saved") || "[]"
    );
    setSaved(stored.includes(stringId));
  }, [stringId]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Please log in before saving internships.");
      return;
    }

    setLoading(true);

    try {
      if (saved) {
        const response = await fetch(
          `http://127.0.0.1:5001/saved/${stringId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to remove saved internship: ${response.status}`);
        }

        const stored: string[] = JSON.parse(
          localStorage.getItem("saved") || "[]"
        );

        localStorage.setItem(
          "saved",
          JSON.stringify(stored.filter((item) => item !== stringId))
        );

        setSaved(false);
      } else {
        const response = await fetch(
          `http://127.0.0.1:5001/saved/${stringId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to save internship: ${response.status}`);
        }

        const stored: string[] = JSON.parse(
          localStorage.getItem("saved") || "[]"
        );

        if (!stored.includes(stringId)) {
          localStorage.setItem(
            "saved",
            JSON.stringify([...stored, stringId])
          );
        }

        setSaved(true);
      }
    } catch (error) {
      console.error("Save internship error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      aria-label={saved ? "Remove saved internship" : "Save internship"}
      className="p-2.5 rounded-2xl bg-card/80 border border-border hover:bg-muted transition-all duration-300 disabled:opacity-50 shadow-sm active:scale-95"
    >
      <Bookmark
        className={`h-4 w-4 transition-colors duration-300 ${
          saved
            ? "fill-primary text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
      />
    </button>
  );
};

export default SaveButton;