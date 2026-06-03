import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Database,
  Network,
  Settings,
  PlugZap,
} from "lucide-react";
import type { HardwarePart } from "../../types";
import { cn } from "../../utils/cn";

interface DiagramProps {
  parts: HardwarePart[];
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
}

/* ── icon lookup ── */
const iconMap: Record<string, React.ReactNode> = {
  gpu: (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="8" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="11" y="8" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
      <line x1="4" y1="15" x2="4" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="15" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="15" x2="16" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cpu: <Cpu className="h-4 w-4" />,
  "memory-stick": <MemoryStick className="h-4 w-4" />,
  "hard-drive": <HardDrive className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  network: <Network className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  "plug-zap": <PlugZap className="h-4 w-4" />,
};

/* ── component decorations per part ── */
function PartVisual({ partId }: { partId: string }) {
  switch (partId) {
    case "gpu-l4":
      return (
        <div className="flex items-center gap-2">
          {/* stylised GPU card */}
          <div className="flex h-8 w-28 items-center rounded-md border border-emerald-700/40 bg-gradient-to-r from-[#1a2a1e] to-[#1e2d22]">
            <div className="mx-1.5 grid grid-cols-4 gap-[3px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-[1px] bg-emerald-500/50" />
              ))}
            </div>
            <span className="ml-auto mr-2 font-mono text-[9px] text-emerald-400/80">24GB</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[3px] w-3 rounded-full bg-[#3f4652]" />
            ))}
          </div>
        </div>
      );
    case "cpu-server":
      return (
        <div className="relative flex h-12 w-12 items-center justify-center rounded-md border border-[#4b5563] bg-[#121820]">
          <div className="h-7 w-7 rounded-sm border border-[#697386] bg-gradient-to-br from-[#252c35] to-[#1a1f27]" />
          {/* pins */}
          <div className="absolute -bottom-1 left-1 right-1 flex justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 w-[3px] rounded-full bg-[#4b5563]" />
            ))}
          </div>
        </div>
      );
    case "ram-ecc":
      return (
        <div className="flex items-end gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-[2px]">
              <div className="h-10 w-2.5 rounded-t-sm border border-[#718096] bg-gradient-to-b from-[#26313d] to-[#1e2730]" />
              <div className="h-1 w-2 rounded-full bg-[#4b5563]" />
            </div>
          ))}
          <div className="ml-2 flex items-end gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-[2px]">
                <div className="h-10 w-2.5 rounded-t-sm border border-[#718096] bg-gradient-to-b from-[#26313d] to-[#1e2730]" />
                <div className="h-1 w-2 rounded-full bg-[#4b5563]" />
              </div>
            ))}
          </div>
        </div>
      );
    case "os-ssd":
      return (
        <div className="flex gap-1.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex h-6 w-16 items-center rounded border border-[#4b5563] bg-[#151b23] px-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
              <span className="ml-auto font-mono text-[8px] text-[#aeb7c6]">NVMe</span>
            </div>
          ))}
        </div>
      );
    case "event-cache-ssd":
      return (
        <div className="flex h-6 w-20 items-center rounded border border-[#4b5563] bg-[#151b23] px-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-500/60" />
          <span className="ml-auto font-mono text-[8px] text-[#aeb7c6]">Cache</span>
        </div>
      );
    case "nic-10gbe":
      return (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1].map((i) => (
              <div key={i} className="flex h-5 w-7 items-center justify-center rounded border border-amber-600/40 bg-[#1e1a13]">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500/70" />
              </div>
            ))}
          </div>
          <span className="font-mono text-[8px] text-[#aeb7c6]">SFP+</span>
          <div className="flex gap-1">
            {[0, 1].map((i) => (
              <div key={i} className="h-4 w-4 rounded border border-[#4b5563] bg-[#151b23]" />
            ))}
          </div>
          <span className="font-mono text-[8px] text-[#aeb7c6]">1G</span>
        </div>
      );
    case "management-ipmi":
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-[#5b6678] bg-[#0c1016]">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded border border-[#5b6678] bg-[#0c1016]">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          </div>
          <span className="font-mono text-[8px] text-[#aeb7c6]">RJ45</span>
        </div>
      );
    case "psu-dual":
      return (
        <div className="flex items-center gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex h-7 w-14 items-center rounded border border-[#4b5563] bg-gradient-to-r from-[#151b23] to-[#1a2027]">
              <div className="mx-1.5 grid grid-cols-3 gap-[2px]">
                {[0, 1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-1 w-1 rounded-full bg-[#3c4653]" />
                ))}
              </div>
              <div className="ml-auto mr-1 h-2 w-2 rounded-full bg-emerald-500/60" />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export const ServerDiagram: React.FC<DiagramProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
}) => {
  /* define layout order — groups for the vertical motherboard view */
  const layoutOrder = [
    { id: "management-ipmi", span: "full" },
    { id: "cpu-server", span: "left" },
    { id: "ram-ecc", span: "right" },
    { id: "gpu-l4", span: "full" },
    { id: "os-ssd", span: "left" },
    { id: "event-cache-ssd", span: "right" },
    { id: "nic-10gbe", span: "left" },
    { id: "psu-dual", span: "right" },
  ] as const;

  const partMap = new Map(parts.map((p) => [p.id, p]));

  return (
    <div className="relative flex flex-col items-center">
      {/* Title */}
      <span className="mb-2 block font-mono text-[11px] tracking-wide text-[var(--mute)]">
        AI Server 2U / rack inference node
      </span>

      {/* Chassis wrapper */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border-2 border-[#343b46] bg-gradient-to-b from-[#1a1f27] to-[#111418] shadow-lg">
        {/* Chassis screw details */}
        <div className="pointer-events-none absolute left-2 top-2 h-2 w-2 rounded-full border border-[#4b5563] bg-[#252c35]" />
        <div className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full border border-[#4b5563] bg-[#252c35]" />
        <div className="pointer-events-none absolute bottom-2 left-2 h-2 w-2 rounded-full border border-[#4b5563] bg-[#252c35]" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 rounded-full border border-[#4b5563] bg-[#252c35]" />

        {/* Motherboard area */}
        <div
          className="relative mx-3 my-4 rounded-xl border border-[#2b323d] p-3"
          style={{
            background: `
              radial-gradient(circle at 1px 1px, #2b323d 0.5px, transparent 0.5px)
            `,
            backgroundSize: "12px 12px",
            backgroundColor: "#11161d",
          }}
        >
          {/* Layout grid */}
          <div className="grid grid-cols-2 gap-2">
            {layoutOrder.map(({ id, span }) => {
              const part = partMap.get(id);
              if (!part) return null;
              const selected = selectedPartId === id;
              const icon = part.icon ? iconMap[part.icon] : null;

              return (
                <motion.button
                  key={id}
                  type="button"
                  aria-label={`Chọn ${part.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPart(id);
                  }}
                  className={cn(
                    "group relative flex flex-col items-start gap-1.5 rounded-lg border p-2.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer",
                    span === "full" ? "col-span-2" : "",
                    selected
                      ? "z-20 border-emerald-500/60 bg-[#1a2a1e]/80 shadow-[0_0_12px_rgba(16,185,129,0.12)] hover:z-30 focus-visible:z-30"
                      : "z-10 border-[#2b323d] bg-[#151b23]/60 hover:border-[#4b5563] hover:bg-[#1a1f27]/80 hover:z-30 focus-visible:z-30"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Floating Tooltip */}
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
                    Click để xem {part.shortLabel}
                  </span>

                  {/* Hotspot Dot Marker */}
                  <span className={cn(
                    "absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full transition-colors",
                    selected ? "bg-emerald-400 ring-2 ring-emerald-400/40" : "bg-emerald-500/40 ring-1 ring-emerald-500/20 group-hover:bg-emerald-400"
                  )} />

                  {/* Selected indicator */}
                  {selected && (
                    <motion.div
                      className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#111418] bg-emerald-400"
                      layoutId="server-indicator"
                      initial={false}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                      }}
                    />
                  )}

                  {/* Header: icon + label */}
                  <div className="flex w-full items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md border transition-colors",
                        selected
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          : "border-[#3f4652] bg-[#1a1f27] text-[#aeb7c6] group-hover:text-[#d8dee8]"
                      )}
                    >
                      {icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-[11px] font-semibold leading-tight transition-colors",
                          selected ? "text-emerald-300" : "text-[#d8dee8]"
                        )}
                      >
                        {part.shortLabel}
                      </span>
                      <span className="block truncate text-[9px] text-[#697386]">
                        {part.label}
                      </span>
                    </div>
                  </div>

                  {/* Part visual */}
                  <div className="mt-0.5 w-full">
                    <PartVisual partId={id} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom chassis bar (front panel) */}
        <div className="mx-3 mb-3 flex h-3 items-center justify-center rounded-full bg-[#0d1117]">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1 w-4 rounded-full bg-[#252c35]" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend Hint */}
      <span className="mt-2.5 text-[9px] text-[var(--mute)] flex items-center gap-1 font-mono">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Chấm sáng / vùng viền sáng là thành phần có thể bấm để xem chi tiết.
      </span>
    </div>
  );
};
