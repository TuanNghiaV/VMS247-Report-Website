import React from "react";
import { cn } from "../../utils/cn";

export type TechStatus = "core" | "optional" | "future";

interface TechBadgeProps {
  name: string;
  status: TechStatus;
  className?: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  name,
  status,
  className,
}) => {
  const dotColors = {
    core: "bg-[var(--success)]",
    optional: "bg-[var(--body)]",
    future: "bg-[var(--warning)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold font-mono text-[var(--body)] select-none",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[status])} />
      <span>{name}</span>
    </span>
  );
};
