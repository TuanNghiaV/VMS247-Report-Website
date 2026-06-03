import React from "react";
import { TechBadge } from "./TechBadge";
import type { TechStatus } from "./TechBadge";

type ClassificationGroup = {
  title: string;
  status: TechStatus;
  items: string[];
};

interface TechChapterLabelProps {
  index: number;
  total?: number;
}

interface ClassificationStripProps {
  groups: ClassificationGroup[];
  className?: string;
}

export const TechChapterLabel: React.FC<TechChapterLabelProps> = ({
  index,
  total = 6,
}) => (
  <div className="mb-2 inline-flex rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
    Nghiên cứu công nghệ khả thi · {index}/{total}
  </div>
);

export const ClassificationStrip: React.FC<ClassificationStripProps> = ({
  groups,
  className,
}) => (
  <div className={className ?? "grid grid-cols-1 gap-2 md:grid-cols-3"}>
    {groups.map((group) => (
      <div
        key={group.title}
        className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-3"
      >
        <TechBadge name={group.title} status={group.status} className="mb-2 px-2 py-0.5 text-[10px]" />
        <p className="text-[11px] leading-relaxed text-[var(--body)]">
          {group.items.join(" · ")}
        </p>
      </div>
    ))}
  </div>
);
