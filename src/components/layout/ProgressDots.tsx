import React, { useState } from "react";
import { type SectionInfo } from "../../data/sections";
import { cn } from "../../utils/cn";

interface ProgressDotsProps {
  sections: SectionInfo[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  sections,
  activeIndex,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] transition-all duration-300 shadow-md select-none p-2 overflow-hidden",
        isExpanded ? "w-64" : "w-10"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
      data-section-nav-ignore="true"
    >
      <div className="flex flex-col gap-1.5" data-section-nav-ignore="true">
        {sections.map((section, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(idx)}
              className={cn(
                "flex items-center rounded-md p-1 transition-all cursor-pointer text-left focus:outline-none w-full",
                isActive
                  ? "bg-[var(--surface-soft)] text-[var(--primary)] font-bold"
                  : "text-[var(--body)] hover:bg-[var(--canvas-soft)] hover:text-[var(--ink)]"
              )}
              aria-label={`Đi đến slide ${idx + 1}: ${section.shortTitle}`}
            >
              {/* Number Circle or Marker */}
              <span
                className={cn(
                  "font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full shrink-0 border transition-all duration-200",
                  isActive
                    ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)] font-bold scale-105"
                    : "border-[var(--hairline)] bg-[var(--canvas-soft)] text-[var(--mute)]"
                )}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Title text, visible when expanded */}
              <span
                className={cn(
                  "ml-2.5 text-[11px] truncate transition-all duration-200 origin-left whitespace-nowrap",
                  isExpanded ? "opacity-100 max-w-[190px] pointer-events-auto" : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                {section.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
