import React from "react";
import { motion } from "framer-motion";
import {
  Video,
  ArrowUpDown,
  Server,
  HardDrive,
  Clock,
} from "lucide-react";
import type { HardwarePart } from "../../types";
import { cn } from "../../utils/cn";

interface DiagramProps {
  parts: HardwarePart[];
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
}

/* ── Reusable node button ── */
function NetNode({
  partId,
  part,
  selectedId,
  onSelect,
  icon,
  accentColor = "emerald",
  children,
  className,
}: {
  partId: string;
  part: HardwarePart | undefined;
  selectedId: string;
  onSelect: (id: string) => void;
  icon: React.ReactNode;
  accentColor?: "emerald" | "blue" | "amber" | "violet" | "orange" | "cyan";
  children?: React.ReactNode;
  className?: string;
}) {
  if (!part) return null;
  const selected = selectedId === partId;
  const colorMap = {
    emerald: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    blue: { border: "border-blue-500/50", bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    amber: { border: "border-amber-500/50", bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    violet: { border: "border-violet-500/50", bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    orange: { border: "border-orange-500/50", bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
    cyan: { border: "border-cyan-500/50", bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400" },
  };
  const c = colorMap[accentColor];

  return (
    <motion.button
      type="button"
      aria-label={`Chọn ${part.label}`}
      onClick={(e) => { e.stopPropagation(); onSelect(partId); }}
      className={cn(
        "group relative flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer",
        selected
          ? `${c.border} ${c.bg} shadow-[0_0_12px_rgba(16,185,129,0.12)] border-emerald-500/60 z-20 hover:z-30 focus-visible:z-30`
          : "border-[#2b323d] bg-[#151b23]/80 hover:border-[#4b5563] hover:bg-[#1a1f27] z-10 hover:z-30 focus-visible:z-30",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Floating Tooltip */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
        Click để xem {part.shortLabel}
      </span>

      {/* Hotspot Dot Marker */}
      <span className={cn(
        "absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-colors",
        selected ? "bg-emerald-400 ring-2 ring-emerald-400/40" : "bg-emerald-500/40 ring-1 ring-emerald-500/20 group-hover:bg-emerald-400"
      )} />

      <span className={cn(
        "flex h-6 w-6 items-center justify-center rounded-md border transition-colors",
        selected ? `${c.border} ${c.bg} ${c.text}` : "border-[#3f4652] bg-[#1a1f27] text-[#697386]"
      )}>
        {icon}
      </span>
      <span className={cn(
        "text-[10px] font-semibold transition-colors",
        selected ? c.text : "text-[#aeb7c6]"
      )}>
        {part.shortLabel}
      </span>
      {children}
      {selected && (
        <motion.div
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#111418] bg-emerald-400"
          initial={false}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
        />
      )}
    </motion.button>
  );
}

/* ── Flow arrow ── */
function FlowArrow({ direction = "down", label }: { direction?: "down" | "right" | "left"; label?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      direction === "down" ? "flex-col py-0.5" : "flex-row px-1"
    )}>
      {label && (
        <span className="font-mono text-[8px] text-[#53606f]">{label}</span>
      )}
      <svg
        className={cn("text-[#53606f]", direction === "down" ? "h-4 w-3" : "h-3 w-4")}
        viewBox="0 0 12 16"
        fill="none"
      >
        {direction === "down" ? (
          <>
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 9 L6 14 L10 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : direction === "right" ? (
          <>
            <line x1="0" y1="8" x2="10" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4 L12 8 L7 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <line x1="2" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 4 L0 8 L5 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    </div>
  );
}

export const NetworkDiagram: React.FC<DiagramProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
}) => {
  const partMap = new Map(parts.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 block font-mono text-[11px] tracking-wide text-[var(--mute)]">
        Camera VLAN → PoE Switch → Core 10GbE → AI Server / NAS
      </span>

      <div className="w-full max-w-[520px] space-y-1">
        {/* Row 1: Camera VLAN + Core 10G + Destinations */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
          {/* Camera VLAN */}
          <NetNode
            partId="camera-vlan"
            part={partMap.get("camera-vlan")}
            selectedId={selectedPartId}
            onSelect={onSelectPart}
            icon={<Video className="h-3.5 w-3.5" />}
            accentColor="blue"
          >
            {/* Mini camera icons */}
            <div className="mt-0.5 flex flex-wrap justify-center gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-3.5 w-4 items-center justify-center rounded-[3px] border border-[#3f4652] bg-[#1e242e]"
                >
                  <div className="h-1 w-1 rounded-full bg-emerald-500/60" />
                </div>
              ))}
            </div>
            <span className="mt-0.5 font-mono text-[7px] text-[#53606f]">18 camera</span>
          </NetNode>

          {/* Core/Uplink 10GbE — top center */}
          <div className="flex flex-col items-center">
            <NetNode
              partId="switch-core-10g"
              part={partMap.get("switch-core-10g")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              accentColor="amber"
            />
          </div>

          {/* AI Server + NAS */}
          <div className="flex flex-col gap-1.5">
            <NetNode
              partId="network-ai-server"
              part={partMap.get("network-ai-server")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<Server className="h-3.5 w-3.5" />}
              accentColor="emerald"
            />
            <NetNode
              partId="network-nas"
              part={partMap.get("network-nas")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<HardDrive className="h-3.5 w-3.5" />}
              accentColor="violet"
            />
          </div>
        </div>

        {/* Flow indicators */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex justify-center"><FlowArrow direction="down" /></div>
          <div className="flex justify-center"><FlowArrow direction="down" /></div>
          <div />
        </div>

        {/* Row 2: PoE Switch — center, spanning full width */}
        <NetNode
          partId="poe-switch"
          part={partMap.get("poe-switch")}
          selectedId={selectedPartId}
          onSelect={onSelectPart}
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
              <rect x="2" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="6" y1="9" x2="6" y2="11" stroke="currentColor" strokeWidth="1" />
              <line x1="8" y1="9" x2="8" y2="11" stroke="currentColor" strokeWidth="1" />
              <line x1="10" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="1" />
              <line x1="12" y1="9" x2="12" y2="11" stroke="currentColor" strokeWidth="1" />
              <line x1="14" y1="9" x2="14" y2="11" stroke="currentColor" strokeWidth="1" />
            </svg>
          }
          accentColor="cyan"
          className="w-full"
        >
          {/* Port visualization */}
          <div className="mt-1 flex items-center gap-0.5 rounded-md border border-[#2b323d] bg-[#10151c] px-2 py-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-1.5 rounded-[1px] border",
                  i < 9
                    ? "border-[#3f4652] bg-[#253242]"
                    : "border-amber-700/40 bg-[#3b2f18]"
                )}
              />
            ))}
            <div className="ml-0.5 h-2 w-1.5 rounded-[1px] border border-[#3f4652] bg-[#253242]" />
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={`r-${i}`}
                className="h-2 w-1.5 rounded-[1px] border border-[#3f4652] bg-[#253242]"
              />
            ))}
            <div className="ml-1 flex h-3 w-4 items-center justify-center rounded border border-amber-600/40 bg-[#1e1a13]">
              <span className="text-[5px] text-amber-400">SFP</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[7px] text-[#53606f]">24 × 1GbE + SFP+ uplink</span>
          </div>
        </NetNode>

        {/* NTP — small at bottom left */}
        <div className="flex justify-start pt-1">
          <NetNode
            partId="local-ntp"
            part={partMap.get("local-ntp")}
            selectedId={selectedPartId}
            onSelect={onSelectPart}
            icon={<Clock className="h-3.5 w-3.5" />}
            accentColor="orange"
            className="w-auto min-w-[80px]"
          >
            <span className="font-mono text-[7px] text-[#53606f]">timestamp sync</span>
          </NetNode>
        </div>
      </div>

      {/* Legend Hint */}
      <span className="mt-4 text-[9px] text-[var(--mute)] flex items-center gap-1 font-mono">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Chấm sáng / vùng viền sáng là thành phần có thể bấm để xem chi tiết.
      </span>
    </div>
  );
};
