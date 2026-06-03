import React from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "amber" | "blue" | "zinc";
  hoverGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor: _glowColor,
  hoverGlow = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] transition-all duration-200",
        hoverGlow && "hover:border-[var(--hairline-strong)] hover:bg-[var(--surface-soft)]",
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};
