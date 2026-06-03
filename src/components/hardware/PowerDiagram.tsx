import React from "react";
import { motion } from "framer-motion";
import {
  BatteryCharging,
  Cable,
  Server,
  HardDrive,
  Video,
} from "lucide-react";
import type { HardwarePart } from "../../types";
import { cn } from "../../utils/cn";

interface DiagramProps {
  parts: HardwarePart[];
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
}

/* ── Shared power node ── */
function PowerNode({
  partId,
  part,
  selectedId,
  onSelect,
  icon,
  accentColor = "emerald",
  wattLabel,
  children,
  className,
}: {
  partId: string;
  part: HardwarePart | undefined;
  selectedId: string;
  onSelect: (id: string) => void;
  icon: React.ReactNode;
  accentColor?: "emerald" | "blue" | "amber" | "violet" | "orange" | "cyan";
  wattLabel?: string;
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
        "group relative flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer",
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
      {wattLabel && (
        <span className="font-mono text-[8px] text-[#53606f]">{wattLabel}</span>
      )}
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

/* ── Flow arrow connector ── */
function PowerArrow() {
  return (
    <div className="flex items-center justify-center px-0.5">
      <svg className="h-3 w-6 text-[#53606f]" viewBox="0 0 24 12" fill="none">
        <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M15 2 L21 6 L15 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Router icon SVG ── */
function RouterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2" y="6" width="16" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="9" x2="6" y2="11" stroke="currentColor" strokeWidth="1" />
      <line x1="10" y1="9" x2="10" y2="11" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="9" x2="14" y2="11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export const PowerDiagram: React.FC<DiagramProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
}) => {
  const partMap = new Map(parts.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 block font-mono text-[11px] tracking-wide text-[var(--mute)]">
        Online UPS → PDU → AI Server / NAS / Switch PoE / Camera PoE
      </span>

      <div className="w-full max-w-[540px]">
        {/* Main power chain — horizontal flow */}
        <div className="flex items-center justify-center gap-0.5">
          {/* UPS */}
          <PowerNode
            partId="ups-online"
            part={partMap.get("ups-online")}
            selectedId={selectedPartId}
            onSelect={onSelectPart}
            icon={<BatteryCharging className="h-3.5 w-3.5" />}
            accentColor="emerald"
            className="min-w-[110px]"
          >
            {/* UPS display */}
            <div className="mt-0.5 flex w-full flex-col items-center gap-1 rounded-md border border-[#2b323d] bg-[#10151c] px-2 py-1.5">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
                <span className="font-mono text-[9px] font-bold text-emerald-400">3kVA</span>
              </div>
              {/* Battery bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1f27]">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
              </div>
              <span className="font-mono text-[7px] text-[#53606f]">Online / 0ms</span>
            </div>
            {/* Outlets */}
            <div className="mt-1 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-2 w-4 rounded-sm border border-[#3f4652] bg-[#253242]" />
              ))}
            </div>
          </PowerNode>

          <PowerArrow />

          {/* PDU */}
          <PowerNode
            partId="pdu-output"
            part={partMap.get("pdu-output")}
            selectedId={selectedPartId}
            onSelect={onSelectPart}
            icon={<Cable className="h-3.5 w-3.5" />}
            accentColor="violet"
            className="min-w-[80px]"
          >
            {/* PDU outlets */}
            <div className="mt-0.5 flex flex-col gap-0.5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="h-1.5 w-6 rounded-sm border border-[#3f4652] bg-[#253242]" />
                  <div className={cn(
                    "h-1 w-1 rounded-full",
                    i < 4 ? "bg-emerald-500/60" : "bg-[#3f4652]"
                  )} />
                </div>
              ))}
            </div>
          </PowerNode>

          <PowerArrow />

          {/* Load targets */}
          <div className="flex flex-col gap-1.5">
            <PowerNode
              partId="server-load"
              part={partMap.get("server-load")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<Server className="h-3.5 w-3.5" />}
              accentColor="blue"
              wattLabel="~350W"
              className="min-w-[90px]"
            />
            <PowerNode
              partId="nas-load"
              part={partMap.get("nas-load")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<HardDrive className="h-3.5 w-3.5" />}
              accentColor="amber"
              wattLabel="~120W"
              className="min-w-[90px]"
            />
            <PowerNode
              partId="switch-load"
              part={partMap.get("switch-load")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<RouterIcon className="h-3.5 w-3.5" />}
              accentColor="cyan"
              wattLabel="PoE 250W"
              className="min-w-[90px]"
            />
            <PowerNode
              partId="camera-poe-load"
              part={partMap.get("camera-poe-load")}
              selectedId={selectedPartId}
              onSelect={onSelectPart}
              icon={<Video className="h-3.5 w-3.5" />}
              accentColor="orange"
              wattLabel="~144W"
              className="min-w-[90px]"
            />
          </div>
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
