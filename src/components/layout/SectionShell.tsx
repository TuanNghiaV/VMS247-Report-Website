import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface SectionShellProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  contentClassName?: string;
  isActive: boolean;
}

export const SectionShell: React.FC<SectionShellProps> = ({
  children,
  id,
  className,
  contentClassName,
  isActive,
}) => {
  return (
    <div
      id={id}
      className={cn(
        "w-full h-[100svh] relative flex flex-col justify-start pt-20 pb-8 px-6 md:px-12 lg:px-20 select-text overflow-hidden bg-[var(--canvas)] transition-colors duration-300",
        className
      )}
    >
      <motion.div
        className={cn(
          "relative z-10 w-full mx-auto h-full flex flex-col justify-start",
          contentClassName ?? "max-w-5xl"
        )}
        initial={{ opacity: 0, y: 15 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
