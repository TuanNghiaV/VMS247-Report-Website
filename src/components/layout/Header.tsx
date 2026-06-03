import React, { useState, useEffect, useRef } from "react";
import { type SectionInfo } from "../../data/sections";
import { ChevronLeft, ChevronRight, Cpu, Sun, Moon } from "lucide-react";
import { cn } from "../../utils/cn";

interface HeaderProps {
  sections: SectionInfo[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sections,
  activeIndex,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const currentSection = sections[activeIndex];
  const totalSections = sections.length;
  const progressPercent = ((activeIndex + 1) / totalSections) * 100;

  const prevSection = activeIndex > 0 ? sections[activeIndex - 1] : null;
  const nextSection = activeIndex < totalSections - 1 ? sections[activeIndex + 1] : null;

  const prevLabel = prevSection ? `Trước: ${prevSection.shortTitle || prevSection.title}` : "Đầu trang";
  const nextLabel = nextSection ? `Tiếp: ${nextSection.shortTitle || nextSection.title}` : "Cuối trang";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--canvas)] border-b border-[var(--hairline)] z-50 flex items-center justify-between px-6 md:px-12 select-none transition-colors duration-300">
      {/* Left: Brand logo */}
      <div className="flex items-center gap-2 shrink-0">
        <Cpu className="h-4 w-4 text-[var(--ink)]" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold tracking-tight text-[var(--ink)] font-mono">
            VMS247
          </span>
          <span className="text-[9px] text-[var(--body)] font-mono uppercase tracking-wider hidden sm:inline">
            Báo Cáo Kỹ Thuật
          </span>
        </div>
      </div>

      {/* Center: Interactive Section Switcher Pill */}
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 md:px-4 rounded-[var(--radius-pill)] border transition-all cursor-pointer text-xs font-semibold select-none shadow-xs max-w-[240px] sm:max-w-xs md:max-w-md",
            isDropdownOpen
              ? "border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)] ring-2 ring-[var(--ink)]/10"
              : "border-[var(--hairline-strong)] bg-[var(--surface-soft)] hover:bg-[var(--surface)] text-[var(--ink)]"
          )}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-label="Chọn chương báo cáo"
        >
          <span className="font-mono text-[var(--body)] font-medium shrink-0">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
          </span>
          <span className="text-[var(--mute)] shrink-0">•</span>
          <span className="truncate">
            {currentSection?.shortTitle || currentSection?.title}
          </span>
          <span
            className={cn(
              "text-[var(--mute)] ml-1 text-[8px] transition-transform duration-200 shrink-0",
              isDropdownOpen && "rotate-180 text-[var(--body)]"
            )}
          >
            ▼
          </span>
        </button>

        {/* Dropdown TOC list */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-11 left-1/2 -translate-x-1/2 w-64 md:w-72 max-h-72 overflow-y-auto bg-[var(--surface)] border border-[var(--hairline-strong)] rounded-[var(--radius-card)] shadow-lg z-50 py-1.5 flex flex-col"
            data-section-nav-ignore="true"
            role="listbox"
          >
            {sections.map((section, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={section.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onNavigate(idx);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer border-l-2",
                    isActive
                      ? "bg-[var(--surface-soft)] text-[var(--primary)] font-semibold border-[var(--primary)] pl-[12px]"
                      : "text-[var(--body)] hover:bg-[var(--canvas-soft)] hover:text-[var(--ink)] border-transparent"
                  )}
                >
                  <span className="font-mono text-[10px] text-[var(--mute)] shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{section.shortTitle || section.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Controls & Theme Toggle */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-1.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--canvas-soft)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label={prevLabel}
            title={prevLabel}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onNavigate(activeIndex + 1)}
            disabled={activeIndex === totalSections - 1}
            className="p-1.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--canvas-soft)] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            aria-label={nextLabel}
            title={nextLabel}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--canvas-soft)] transition-all cursor-pointer flex items-center justify-center"
          aria-label="Chuyển đổi giao diện"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-[var(--warning)]" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-[var(--ink)]" />
          )}
        </button>
      </div>

      {/* Flat progress line indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--hairline)]">
        <div
          className="h-full bg-[var(--primary)] transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
};
