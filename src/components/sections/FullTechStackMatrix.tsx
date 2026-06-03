import React, { useEffect, useState } from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { TechBadge } from "../ui/TechBadge";
import { ClassificationStrip, TechChapterLabel } from "../ui/TechChapter";
import { techStackData } from "../../data/techStack";
import { cn } from "../../utils/cn";
import { HelpCircle, Info } from "lucide-react";
import type { TechStatus } from "../ui/TechBadge";

interface SectionProps {
  isActive?: boolean;
}

const statusLabel: Record<TechStatus, string> = {
  core: "Core Pilot",
  optional: "Optional",
  future: "Future/R&D",
};

const statusGroups = [
  {
    title: "Core Pilot",
    status: "core" as const,
    items: ["RTSP", "DeepStream", "TensorRT", "FastAPI", "PostgreSQL", "MinIO", "Prometheus"],
  },
  {
    title: "Optional",
    status: "optional" as const,
    items: ["NATS JetStream", "Redis", "ClickHouse", "Keycloak", "Triton"],
  },
  {
    title: "Future/R&D",
    status: "future" as const,
    items: ["RT-DETR", "Grounding DINO", "PatchCore", "OpenVINO", "OPC UA"],
  },
];

export const FullTechStackMatrix: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState(techStackData[0].id);
  const selectedCategory = techStackData.find((category) => category.id === activeCategoryId) ?? techStackData[0];
  const [selectedTechName, setSelectedTechName] = useState(selectedCategory.items[0]?.name ?? "");

  useEffect(() => {
    setSelectedTechName(selectedCategory.items[0]?.name ?? "");
  }, [selectedCategory]);

  const selectedTech =
    selectedCategory.items.find((item) => item.name === selectedTechName) ?? selectedCategory.items[0];
  const selectedStatus = selectedTech?.status ?? "future";

  return (
    <SectionShell id="tech-stack-explorer" isActive={isActive}>
      <div className="mb-3">
        <TechChapterLabel index={1} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Nghiên cứu công nghệ khả thi
        </h2>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--body)]">
          Bản đồ tổng quan các công nghệ phù hợp cho VMS247, phân loại theo Core Pilot, Optional và Future/R&D.
        </p>
      </div>

      <ClassificationStrip groups={statusGroups} className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3" />

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1" data-section-nav-ignore="true">
        {techStackData.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategoryId(category.id)}
            className={cn(
              "whitespace-nowrap rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none",
              activeCategoryId === category.id
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]"
                : "border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--body)]"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-3" data-section-nav-ignore="true">
        <div className="flex max-h-[calc(100svh-330px)] flex-col gap-3 overflow-y-auto pr-1 lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {selectedCategory.items.map((item) => {
              const status = item.status ?? "future";
              return (
                <GlassCard
                  key={item.name}
                  onClick={() => setSelectedTechName(item.name)}
                  className={cn(
                    "cursor-pointer border p-4 transition-colors",
                    selectedTechName === item.name
                      ? "border-[var(--primary)] bg-[var(--surface-soft)]"
                      : "border-[var(--hairline)]"
                  )}
                  hoverGlow={false}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-mono text-xs font-semibold text-[var(--ink)]">{item.name}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-[var(--body)]">{item.architecturePosition}</p>
                    </div>
                    <TechBadge name={statusLabel[status]} status={status} className="shrink-0 px-2 py-0.5 text-[10px]" />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className="max-h-[calc(100svh-330px)] overflow-y-auto pr-1">
          {selectedTech ? (
            <GlassCard className="border border-[var(--hairline-strong)] p-5" hoverGlow={false}>
              <div className="mb-3 flex items-start justify-between gap-3 border-b border-[var(--hairline)] pb-3">
                <div>
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
                    {selectedTech.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--mute)]">
                    {selectedTech.sourceType}
                  </p>
                </div>
                <TechBadge name={statusLabel[selectedStatus]} status={selectedStatus} className="px-2 py-0.5 text-[10px]" />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-[var(--ink)]">Vai trò:</span>
                  <p className="mt-1 leading-relaxed text-[var(--body)]">{selectedTech.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-[var(--ink)]">Lý do chọn:</span>
                  <p className="mt-1 leading-relaxed text-[var(--body)]">{selectedTech.whyNeeded}</p>
                </div>
                <div>
                  <span className="font-semibold text-[var(--ink)]">Vị trí kiến trúc:</span>
                  <p className="mt-1 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-2 font-mono text-[11px] text-[var(--body)]">
                    {selectedTech.architecturePosition}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[var(--ink)]">Lưu ý chi phí:</span>
                  <p className="mt-1 leading-relaxed text-[var(--body)]">{selectedTech.costNote}</p>
                </div>
                {selectedTech.alternative ? (
                  <div>
                    <span className="font-semibold text-[var(--ink)]">Phương án thay thế:</span>
                    <p className="mt-1 leading-relaxed text-[var(--mute)]">{selectedTech.alternative}</p>
                  </div>
                ) : null}
              </div>

              {selectedTech.name.includes("YOLO") ? (
                <div className="mt-4 flex gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-3 text-[11px] leading-relaxed text-[var(--body)]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--body)]" />
                  <p>YOLO11/YOLO26 là model ứng viên/baseline, cần benchmark bằng dữ liệu camera thực tế tại Gia Lâm trước khi chốt triển khai chính thức.</p>
                </div>
              ) : null}
            </GlassCard>
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-[var(--hairline-strong)] p-6 text-[var(--mute)]">
              <HelpCircle className="mb-2 h-8 w-8" />
              <p className="text-xs">Chọn công nghệ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
};
