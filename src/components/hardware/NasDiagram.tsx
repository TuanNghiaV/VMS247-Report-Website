import React from "react";
import { motion } from "framer-motion";
import { HardDrive, Shield, Network, Archive, Server } from "lucide-react";
import type { HardwarePart } from "../../types";
import { cn } from "../../utils/cn";

interface DiagramProps {
  parts: HardwarePart[];
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  server: <Server className="h-3.5 w-3.5" />,
  "hard-drive": <HardDrive className="h-3.5 w-3.5" />,
  shield: <Shield className="h-3.5 w-3.5" />,
  network: <Network className="h-3.5 w-3.5" />,
  archive: <Archive className="h-3.5 w-3.5" />,
};

export const NasDiagram: React.FC<DiagramProps> = ({
  parts,
  selectedPartId,
  onSelectPart,
}) => {
  const partMap = new Map(parts.map((p) => [p.id, p]));

  function selectPart(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    onSelectPart(id);
  }

  const isSel = (id: string) => selectedPartId === id;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 block font-mono text-[11px] tracking-wide text-[var(--mute)]">
        NAS 8-bay / RAID 6 evidence storage
      </span>

      {/* === NAS Chassis clickable === */}
      <button
        type="button"
        aria-label={`Chọn ${partMap.get("nas-chassis")?.label}`}
        onClick={(e) => selectPart("nas-chassis", e)}
      className={cn(
        "group relative w-full max-w-[440px] rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer",
        isSel("nas-chassis")
          ? "z-20 border-emerald-500/50 shadow-[0_0_16px_rgba(16,185,129,0.1)] hover:z-30 focus-visible:z-30"
          : "z-10 border-[#343b46] hover:border-[#4b5563] hover:z-30 focus-visible:z-30"
      )}
      style={{ background: "linear-gradient(180deg, #1a1f27 0%, #111418 100%)" }}
    >
      {/* Floating Tooltip */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
        Click để xem NAS 8-bay
      </span>

        {/* Hotspot Dot Marker */}
        <span className={cn(
          "absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full transition-colors",
          isSel("nas-chassis") ? "bg-emerald-400 ring-2 ring-emerald-400/40" : "bg-emerald-500/40 ring-1 ring-emerald-500/20 group-hover:bg-emerald-400"
        )} />

        {/* Top panel — label + status */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "flex h-5 w-5 items-center justify-center rounded",
              isSel("nas-chassis") ? "text-emerald-400" : "text-[#697386]"
            )}>
              {iconMap.server}
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#d8dee8]">
              NAS 8-bay
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-[8px] text-[#697386]">PWR</span>
            </div>
          </div>
        </div>

        {/* Drive bays area */}
        <div className="mx-3 rounded-lg border border-[#2b323d] bg-[#10151c] p-2.5 relative group/bays">
          {/* Tooltip for Drive bays */}
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover/bays:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
            Click để xem Cụm HDD 10TB/12TB
          </span>

          <div className="grid grid-cols-8 gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "relative flex flex-col items-center rounded-md border transition-all duration-150 cursor-pointer",
                  isSel("hdd-set")
                    ? "z-20 border-blue-500/50 bg-[#1a2030] hover:z-30"
                    : "z-10 border-[#3f4652] bg-[#1e242e] hover:border-[#4b5563] hover:z-30"
                )}
                onClick={(e) => { e.stopPropagation(); selectPart("hdd-set", e); }}
                whileHover={{ y: -1 }}
              >
                {/* Hotspot indicator on drives */}
                <span className={cn(
                  "absolute right-1 top-1 h-1 w-1 rounded-full transition-colors",
                  isSel("hdd-set") ? "bg-blue-400" : "bg-blue-400/30"
                )} />

                {/* Drive handle */}
                <div className="mt-1 h-1 w-4/5 rounded-full bg-[#0c1016]" />
                {/* Drive body */}
                <div className="my-1 flex h-10 w-full flex-col items-center justify-center gap-0.5 px-0.5">
                  <HardDrive className="h-3 w-3 text-[#53606f]" />
                  <span className="font-mono text-[7px] text-[#53606f]">{i + 1}</span>
                </div>
                {/* LED */}
                <div className={cn(
                  "mb-1 h-1.5 w-1.5 rounded-full",
                  i < 6 ? "bg-emerald-500/70" : "bg-amber-400/70"
                )} />
              </motion.div>
            ))}
          </div>

          {/* HDD set select overlay indicator */}
          {isSel("hdd-set") && (
            <div className="mt-1.5 text-center">
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-mono text-[8px] text-blue-400">
                8 × HDD 10TB/12TB
              </span>
            </div>
          )}
        </div>

        {/* Bottom info bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-3">
          {/* RAID badge */}
          <motion.button
            type="button"
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all relative group/raid cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              isSel("nas-raid-config")
                ? "z-20 border-violet-500/50 bg-violet-500/10 hover:z-30 focus-visible:z-30"
                : "z-10 border-[#3f4652] bg-[#151b23] hover:border-[#5b6678] hover:z-30 focus-visible:z-30"
            )}
            onClick={(e) => selectPart("nas-raid-config", e)}
            whileTap={{ scale: 0.97 }}
          >
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover/raid:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
              Click để xem RAID 6
            </span>
            <span className={cn(
              "absolute right-1 top-1 h-1 w-1 rounded-full",
              isSel("nas-raid-config") ? "bg-violet-400" : "bg-violet-400/40"
            )} />
            <Shield className={cn(
              "h-3 w-3",
              isSel("nas-raid-config") ? "text-violet-400" : "text-[#697386]"
            )} />
            <span className={cn(
              "font-mono text-[10px] font-semibold",
              isSel("nas-raid-config") ? "text-violet-300" : "text-[#aeb7c6]"
            )}>
              RAID 6
            </span>
          </motion.button>

          {/* 10GbE port */}
          <motion.button
            type="button"
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all relative group/10g cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              isSel("nas-10gbe")
                ? "z-20 border-amber-500/50 bg-amber-500/10 hover:z-30 focus-visible:z-30"
                : "z-10 border-[#3f4652] bg-[#151b23] hover:border-[#5b6678] hover:z-30 focus-visible:z-30"
            )}
            onClick={(e) => selectPart("nas-10gbe", e)}
            whileTap={{ scale: 0.97 }}
          >
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover/10g:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
              Click để xem 10GbE NAS Link
            </span>
            <span className={cn(
              "absolute right-1 top-1 h-1 w-1 rounded-full",
              isSel("nas-10gbe") ? "bg-amber-400" : "bg-amber-400/40"
            )} />
            <Network className={cn(
              "h-3 w-3",
              isSel("nas-10gbe") ? "text-amber-400" : "text-[#697386]"
            )} />
            <span className={cn(
              "font-mono text-[10px] font-semibold",
              isSel("nas-10gbe") ? "text-amber-300" : "text-[#aeb7c6]"
            )}>
              10GbE
            </span>
          </motion.button>
        </div>

        {/* Selected chassis indicator */}
        {isSel("nas-chassis") && (
          <motion.div
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#111418] bg-emerald-400"
            initial={false}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
          />
        )}
      </button>

      {/* Backup policy — below chassis */}
      <motion.button
        type="button"
        aria-label={`Chọn ${partMap.get("backup-policy")?.label}`}
        onClick={(e) => selectPart("backup-policy", e)}
        className={cn(
          "mt-3 flex w-full max-w-[440px] items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer relative group/backup",
          isSel("backup-policy")
            ? "z-20 border-orange-500/50 bg-orange-500/5 shadow-[0_0_8px_rgba(249,115,22,0.06)] hover:z-30 focus-visible:z-30"
            : "z-10 border-[var(--hairline)] bg-[var(--surface-soft)] hover:border-[var(--hairline-strong)] hover:z-30 focus-visible:z-30"
        )}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black text-white px-2 py-0.5 text-[9px] opacity-0 transition-opacity duration-150 group-hover/backup:opacity-100 whitespace-nowrap z-[60] shadow-lg border border-white/25 font-mono">
          Click để xem Chính sách backup
        </span>
        <span className={cn(
          "absolute right-2 top-2 h-1.5 w-1.5 rounded-full transition-colors",
          isSel("backup-policy") ? "bg-orange-400 ring-2 ring-orange-400/40" : "bg-orange-500/40 ring-1 ring-orange-500/20 group-hover:bg-orange-400"
        )} />
        <span className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
          isSel("backup-policy")
            ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
            : "border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--mute)]"
        )}>
          <Archive className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <span className={cn(
            "block text-[11px] font-semibold",
            isSel("backup-policy") ? "text-orange-300" : "text-[var(--ink)]"
          )}>
            Chính sách backup
          </span>
          <span className="block text-[9px] text-[var(--mute)]">
            DB / config / model / bằng chứng
          </span>
        </div>
        {isSel("backup-policy") && (
          <motion.div
            className="ml-auto h-2 w-2 rounded-full bg-orange-400"
            initial={false}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
          />
        )}
      </motion.button>

      {/* Legend Hint */}
      <span className="mt-4 text-[9px] text-[var(--mute)] flex items-center gap-1 font-mono">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Chấm sáng / vùng viền sáng là thành phần có thể bấm để xem chi tiết.
      </span>
    </div>
  );
};
