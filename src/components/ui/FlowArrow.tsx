import React from "react";
import { cn } from "../../utils/cn";

interface FlowArrowProps {
  direction: "right" | "down" | "down-left" | "down-right";
  active?: boolean;
  className?: string;
}

export const FlowArrow: React.FC<FlowArrowProps> = ({
  direction,
  active = false,
  className,
}) => {
  const lineClass = active ? "flow-connector-line-active" : "flow-connector-line-muted";

  if (direction === "right") {
    return (
      <svg
        className={cn("w-8 h-6 flex-shrink-0 select-none", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          className={lineClass}
          d="M2 12h18M14 6l6 6-6 6"
        />
      </svg>
    );
  }

  if (direction === "down") {
    return (
      <svg
        className={cn("w-6 h-8 select-none mx-auto", className)}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          className={lineClass}
          d="M12 2v18M6 14l6 6 6-6"
        />
      </svg>
    );
  }

  if (direction === "down-right") {
    return (
      <svg
        className={cn("w-10 h-10 select-none", className)}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          className={lineClass}
          d="M6 6v14h16M16 14l6 6-6 6"
        />
      </svg>
    );
  }

  // default down-left
  return (
    <svg
      className={cn("w-10 h-10 select-none", className)}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        className={lineClass}
        d="M26 6v14H10M16 14L10 20l6 6"
      />
    </svg>
  );
};
