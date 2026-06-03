import React from "react";
import { GlassCard } from "./GlassCard";
import { type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

interface MetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  trendType?: "positive" | "warning" | "neutral";
  className?: string;
  glowColor?: "cyan" | "amber" | "blue" | "zinc";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  trend,
  trendType = "neutral",
  className,
  glowColor = "cyan",
}) => {
  const trendColors = {
    positive: "text-[var(--success)] bg-[var(--canvas-soft)] border-[var(--hairline)]",
    warning: "text-[var(--warning)] bg-[var(--canvas-soft)] border-[var(--hairline)]",
    neutral: "text-[var(--body)] bg-[var(--canvas-soft)] border-[var(--hairline)]",
  };

  return (
    <GlassCard
      className={cn("p-5 flex flex-col justify-between h-full", className)}
      glowColor={glowColor}
      hoverGlow={false}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-[var(--body)] tracking-wider uppercase">
          {label}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-[var(--radius-pill)] border border-[var(--hairline)] text-[var(--ink)] bg-[var(--canvas-soft)]">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)] font-mono">
          {value}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-[var(--body)] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-semibold border",
              trendColors[trendType]
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </GlassCard>
  );
};
