import React from "react";
import { ArrowRight, Info, Wrench, Lightbulb } from "lucide-react";
import type { HardwarePart } from "../../types";
import { cn } from "../../utils/cn";

interface HardwareDetailPanelProps {
  part: HardwarePart;
  onOpenModal?: (type: "storage" | "ups" | "gpu") => void;
}

export const HardwareDetailPanel: React.FC<HardwareDetailPanelProps> = ({
  part,
  onOpenModal,
}) => {
  return (
    <div
      className="flex-1 flex flex-col justify-between overflow-y-auto rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-4 lg:max-h-[460px] xl:max-h-none max-h-none"
      data-section-nav-ignore="true"
    >
      <div>
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 border-b border-[var(--hairline)] pb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-text)]">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--mute)]">
              Thành phần đang chọn
            </span>
            <h3 className="truncate text-sm font-bold text-[var(--ink)]">{part.label}</h3>
          </div>
          {part.shortLabel && (
            <span className="shrink-0 rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2 py-0.5 text-[9px] font-semibold text-[var(--body)] font-mono">
              {part.shortLabel}
            </span>
          )}
        </div>

        {/* Microcopy guide */}
        <p className="mb-3 text-[10px] text-[var(--mute)] leading-normal">
          Chọn từng thành phần trên mô hình để xem vai trò, cấu hình khuyến nghị, rủi ro và tiêu chí nghiệm thu.
        </p>

        {/* Detail blocks with details/accordion structure */}
        <div className="space-y-2 text-xs leading-relaxed">
          {/* Main Info - Open by default */}
          <div className="space-y-2">
            <DetailBlock icon={<Info className="h-3.5 w-3.5" />} title="Vai trò hạ tầng" value={part.role} />
            {part.recommended && (
              <DetailBlock icon={<Wrench className="h-3.5 w-3.5" />} title="Khuyến nghị cấu hình" value={part.recommended} />
            )}
            <DetailBlock icon={<Lightbulb className="h-3.5 w-3.5" />} title="Lý do kỹ thuật" value={part.why} />
          </div>

          {/* Operational, risk and procurement specs - collapsible */}
          <div className="space-y-1.5 pt-1.5 border-t border-[var(--hairline)]">
            {part.operatingRequirement && (
              <details className="group" open>
                <summary className="flex items-center justify-between font-bold text-[var(--ink)] py-1 cursor-pointer select-none">
                  <span>1. Điều kiện vận hành & Phụ thuộc</span>
                  <span className="text-[10px] text-[var(--mute)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="pl-3 pb-1.5 text-[11px] text-[var(--body)] border-l border-[var(--hairline)] ml-1.5 mt-0.5">
                  {part.operatingRequirement}
                </div>
              </details>
            )}

            {part.risk && (
              <details className="group" open>
                <summary className="flex items-center justify-between font-bold text-[var(--ink)] py-1 cursor-pointer select-none">
                  <span>2. Rủi ro nếu chọn sai thiết bị</span>
                  <span className="text-[10px] text-[var(--mute)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="pl-3 pb-1.5 text-[11px] text-[var(--danger)] border-l border-[var(--danger)]/30 ml-1.5 mt-0.5 bg-[var(--danger)]/5 p-1.5 rounded-r">
                  {part.risk}
                </div>
              </details>
            )}

            {part.acceptanceCriteria && (
              <details className="group">
                <summary className="flex items-center justify-between font-bold text-[var(--ink)] py-1 cursor-pointer select-none">
                  <span>3. Tiêu chí nghiệm thu (Acceptance)</span>
                  <span className="text-[10px] text-[var(--mute)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="pl-3 pb-1.5 text-[11px] text-[var(--body)] border-l border-[var(--hairline)] ml-1.5 mt-0.5">
                  {part.acceptanceCriteria}
                </div>
              </details>
            )}

            {(part.estimatedCost || part.procurementNote) && (
              <details className="group">
                <summary className="flex items-center justify-between font-bold text-[var(--ink)] py-1 cursor-pointer select-none">
                  <span>4. Chi phí & Ghi chú mua sắm</span>
                  <span className="text-[10px] text-[var(--mute)] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="pl-3 pb-1.5 text-[11px] text-[var(--body)] border-l border-[var(--hairline)] ml-1.5 mt-0.5 space-y-1 bg-[var(--success)]/5 p-1.5 rounded-r">
                  {part.estimatedCost && (
                    <div>
                      <strong className="text-[var(--success)]">Đơn giá ước tính: </strong>
                      <span className="font-semibold text-[var(--ink)]">{part.estimatedCost}</span>
                    </div>
                  )}
                  {part.procurementNote && <div>{part.procurementNote}</div>}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>

      {/* Footer and CTA */}
      <div className="mt-4 pt-3 border-t border-[var(--hairline)] space-y-2.5">
        <p className="text-[10px] italic text-[var(--mute)] text-center leading-relaxed">
          * Phù hợp cho pilot 18 camera, nhưng cần benchmark và báo giá chính thức trước khi mua.
        </p>

        {part.ctaLabel ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (part.id === "gpu-l4" && onOpenModal) {
                onOpenModal("gpu");
              }
            }}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-text)] transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer"
          >
            {part.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
};

function DetailBlock({
  icon,
  title,
  value,
  accent,
  warning,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-2.5 py-1.5",
        warning
          ? "border-[var(--warning)]/20 bg-[var(--warning)]/5"
          : accent
            ? "border-[var(--success)]/20 bg-[var(--success)]/5"
            : "border-[var(--hairline)] bg-[var(--canvas-soft)]"
      )}
    >
      <div className="mb-0.5 flex items-center gap-1.5">
        <span className={cn(
          "text-[var(--mute)]",
          warning && "text-[var(--warning)]",
          accent && "text-[var(--success)]",
        )}>
          {icon}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--ink)]">
          {title}
        </span>
      </div>
      <p className="text-[var(--body)] text-[11px] leading-relaxed">{value}</p>
    </div>
  );
}
