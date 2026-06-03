import React, { useState, useEffect, useRef } from "react";
import { SECTIONS } from "../../data/sections";
import { Header } from "./Header";
import { ProgressDots } from "./ProgressDots";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("vms247-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSections = SECTIONS.length;
  const isLocked = useRef(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onNavigate = (index: number) => {
    if (index >= 0 && index < totalSections) {
      setActiveIndex(index);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("vms247-theme", next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (document.body.dataset.modalOpen === "true") {
        e.preventDefault();
        return;
      }

      // 1. Check if the target is within a scrollable area that is flagged to ignore section navigation
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-section-nav-ignore="true"]')) {
        return; // Let the container scroll normally
      }

      // Prevent default page scroll behavior
      e.preventDefault();

      // 2. Throttle/debounce wheel events to prevent rapid multi-slide skipping
      if (isLocked.current) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 10) return; // Ignore small accidental scroll jitters

      if (deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, totalSections - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

      // Lock scrolling for 800ms to allow transition to finish
      isLocked.current = true;
      lockTimeout.current = setTimeout(() => {
        isLocked.current = false;
      }, 700);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.dataset.modalOpen === "true") {
        e.preventDefault();
        return;
      }

      const activeEl = document.activeElement;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest?.('[data-section-nav-ignore="true"]') ||
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.closest('[data-section-nav-ignore="true"]') ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, totalSections - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        if (e.shiftKey) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else {
          setActiveIndex((prev) => Math.min(prev + 1, totalSections - 1));
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(totalSections - 1);
      }
    };

    // Attach passive: false to allow e.preventDefault() in wheel handler
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
    };
  }, [totalSections]);

  // Clone children to pass active status and current activeIndex
  const childrenWithActiveState = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child as React.ReactElement<{
          isActive?: boolean;
          onNavigate?: (index: number) => void;
        }>,
        {
        isActive: index === activeIndex,
        onNavigate: onNavigate,
        }
      );
    }
    return child;
  });

  return (
    <div className="w-full h-[100svh] overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative">
      <Header
        sections={SECTIONS}
        activeIndex={activeIndex}
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container moving by translateY */}
      <div
        className="w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateY(-${activeIndex * 100}svh)` }}
      >
        {childrenWithActiveState}
      </div>

      <ProgressDots
        sections={SECTIONS}
        activeIndex={activeIndex}
        onNavigate={onNavigate}
      />
    </div>
  );
};
