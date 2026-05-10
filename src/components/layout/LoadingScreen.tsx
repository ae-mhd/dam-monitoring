import React, { useEffect, useState } from "react";
import logo from "@/assets/bg-logo.png";
import { useTranslation } from "react-i18next";

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500); // Match transition duration
    }, 2500); // Show loading for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-info/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-colors logo-pulse" />
          <img
            src={logo}
            alt={t("common.logoAlt")}
            className="relative w-32 h-32 md:w-48 md:h-48 object-contain logo-pulse"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(var(--accent),0.1)]">
          <div className="h-full bg-accent progress-load rounded-full relative overflow-hidden">
            {/* Shimmer Effect Overlay */}
            <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-flow" />
          </div>
        </div>
      </div>
    </div>
  );
};
