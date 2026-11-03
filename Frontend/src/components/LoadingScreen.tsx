
import React, { useEffect } from "react";

interface LoadingScreenProps {
  isDark: boolean;
  onLoadingComplete: () => void;
}

export default function LoadingScreen({
  isDark,
  onLoadingComplete,
}: LoadingScreenProps) {
  const videoSrc = isDark
    ? "/ventro-intro-dark.mp4"
    : "/ventro-intro-light.mp4";

  // Fallback so the application never gets stuck if the video fails.
  useEffect(() => {
    const fallback = window.setTimeout(() => {
      onLoadingComplete();
    }, 8000);

    return () => window.clearTimeout(fallback);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] w-screen h-screen overflow-hidden ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      <video
        key={videoSrc}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onLoadingComplete}
        onError={onLoadingComplete}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
