import React from "react";
import { Server, HardDrive, Network, Zap } from "lucide-react";
import type { HardwareExplorerGroup, HardwareExplorerGroupId } from "../../types";
import { cn } from "../../utils/cn";

interface HardwareTabsProps {
  groups: HardwareExplorerGroup[];
  activeGroupId: HardwareExplorerGroupId;
  onSelect: (groupId: HardwareExplorerGroupId) => void;
}

const tabIcons: Record<HardwareExplorerGroupId, React.ReactNode> = {
  "ai-server": <Server className="h-3.5 w-3.5" />,
  "nas-storage": <HardDrive className="h-3.5 w-3.5" />,
  "network-components": <Network className="h-3.5 w-3.5" />,
  "ups-components": <Zap className="h-3.5 w-3.5" />,
};

export const HardwareTabs: React.FC<HardwareTabsProps> = ({
  groups,
  activeGroupId,
  onSelect,
}) => {
  return (
    <div className="mb-2.5 flex flex-row flex-nowrap overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap gap-1.5 scrollbar-none" data-section-nav-ignore="true">
      {groups.map((group) => {
        const active = activeGroupId === group.id;
        return (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              active
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)] shadow-sm"
                : "border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--body)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"
            )}
          >
            {tabIcons[group.id]}
            {group.title}
          </button>
        );
      })}
    </div>
  );
};
