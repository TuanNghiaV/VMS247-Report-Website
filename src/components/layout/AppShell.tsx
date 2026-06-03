import React, { useState, useEffect, useRef } from "react";
import { SECTIONS } from "../../data/sections";
import { Header } from "./Header";
import { ProgressDots } from "./ProgressDots";
import { cn } from "../../utils/cn";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("vms247-theme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalSections = SECTIONS.length;
  const isLocked = useRef(false);
  const lockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check mobile status
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const onNavigate = (index: number) => {
    if (index >= 0 && index < totalSections) {
      setActiveIndex(index);
      if (isMobile) {
        const id = SECTIONS[index].id;
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
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

  // Section Wheel and Keyboard navigation for Desktop
  useEffect(() => {
    if (isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      if (document.body.dataset.modalOpen === "true") {
        e.preventDefault();
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-section-nav-ignore="true"]')) {
        return;
      }

      e.preventDefault();

      if (isLocked.current) return;

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 10) return;

      if (deltaY > 0) {
        setActiveIndex((prev) => Math.min(prev + 1, totalSections - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

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

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (lockTimeout.current) clearTimeout(lockTimeout.current);
    };
  }, [totalSections, isMobile]);

  // Mobile Scrolling synchronization using IntersectionObserver
  useEffect(() => {
    if (!isMobile) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const idx = SECTIONS.findIndex((s) => s.id === id);
          if (idx !== -1) {
            setActiveIndex(idx);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

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
    <div
      className={cn(
        "w-full bg-[var(--canvas)] text-[var(--ink)] transition-colors duration-300 relative",
        isMobile ? "h-[100svh] overflow-y-auto" : "h-[100svh] overflow-hidden"
      )}
    >
      <Header
        sections={SECTIONS}
        activeIndex={activeIndex}
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <div
        className={cn(
          "w-full",
          isMobile
            ? "flex flex-col pt-14"
            : "h-full transition-transform duration-700 ease-in-out"
        )}
        style={isMobile ? undefined : { transform: `translateY(-${activeIndex * 100}svh)` }}
      >
        {childrenWithActiveState}
      </div>

      {!isMobile && (
        <ProgressDots
          sections={SECTIONS}
          activeIndex={activeIndex}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
