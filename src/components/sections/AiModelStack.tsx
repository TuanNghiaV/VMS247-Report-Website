import React, { useState } from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { TechChapterLabel } from "../ui/TechChapter";
import { cn } from "../../utils/cn";
import { aiModules } from "../../data/aiModules";
import { Flame, Focus, Info, Shield, UserCheck, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

const getIcon = (id: number): LucideIcon => {
  switch (id) {
    case 1:
      return Shield;
    case 2:
      return Flame;
    case 3:
      return UserCheck;
    case 4:
      return Focus;
    default:
      return Info;
  }
};

const tabLabels = [
  { id: 1, title: "Xâm nhập", sub: "Person/vehicle + ROI" },
  { id: 2, title: "Cháy/khói", sub: "Smoke/fire debounce" },
  { id: 3, title: "PPE", sub: "Helmet/vest compliance" },
  { id: 4, title: "Chấm công", sub: "Face embedding + Milvus" }
];

const principles = [
  { title: "Benchmark trước, chốt sau", desc: "So sánh FPS & accuracy trên card L4 thực tế." },
  { title: "Ưu tiên đủ tốt", desc: "Dùng bản s/m để tối ưu hóa throughput luồng video." },
  { title: "Tối ưu TensorRT/FP16", desc: "Bắt buộc compile TensorRT để tối ưu hóa phần cứng." },
  { title: "KPI riêng theo module", desc: "Đo precision, recall, false alarm & latency riêng biệt." }
];

// 1. ModuleTabs (Horizontal scroll on mobile, Vertical Rail on Desktop)
interface ModuleTabsProps {
  activeTabId: number;
  setActiveTabId: (id: number) => void;
}

const ModuleTabs: React.FC<ModuleTabsProps> = ({ activeTabId, setActiveTabId }) => {
  return (
    <div className="flex flex-row lg:flex-col gap-2 w-full overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible shrink-0" data-section-nav-ignore="true">
      {tabLabels.map((item) => {
        const Icon = getIcon(item.id);
        const isSelected = activeTabId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTabId(item.id)}
            className={cn(
              "flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--focus-ring)] shrink-0 w-auto lg:w-full",
              isSelected
                ? "bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-text)] shadow-sm"
                : "bg-[var(--canvas-soft)] border-[var(--hairline)] text-[var(--body)] hover:border-[var(--hairline-strong)] hover:bg-[var(--surface-soft)]"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg border shrink-0",
              isSelected 
                ? "bg-[var(--primary-text)] border-[var(--primary-text)] text-[var(--primary)]" 
                : "bg-[var(--canvas)] border-[var(--hairline)] text-[var(--mute)]"
            )}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={cn(
                "text-xs sm:text-sm font-bold leading-tight",
                isSelected ? "text-[var(--primary-text)]" : "text-[var(--ink)]"
              )}>
                {item.title}
              </h4>
              <p className={cn(
                "text-[10px] mt-0.5 leading-none font-mono",
                isSelected ? "text-[var(--primary-text)]/80" : "text-[var(--mute)]"
              )}>
                {item.sub}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// 2. ModuleBrief (Module brief in center, flat layout)
interface ModuleBriefProps {
  module: typeof aiModules[0];
}

const ModuleBrief: React.FC<ModuleBriefProps> = ({ module }) => {
  const ModuleIcon = getIcon(module.id);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 border-b border-[var(--hairline)] pb-2">
        <ModuleIcon className="h-5 w-5 text-[var(--ink)]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--mute)]">Nghiệp vụ chi tiết</span>
        <span className="ml-auto text-xs font-mono text-[var(--ink)] bg-[var(--canvas-soft)] px-2.5 py-0.5 rounded border border-[var(--hairline)]">
          Module {module.id}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-[var(--ink)]">
          {module.title}
        </h3>
        <p className="text-sm text-[var(--body)] leading-relaxed">
          {module.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[var(--canvas-soft)] p-2.5 rounded-lg border border-[var(--hairline)]">
        <div>
          <strong className="text-[var(--ink)] block mb-0.5 text-xs">Mục tiêu phát hiện:</strong>
          <span className="text-[var(--body)] text-[11.5px] leading-normal">{module.detectionGoal}</span>
        </div>
        <div>
          <strong className="text-[var(--ink)] block mb-0.5 text-xs">Đầu ra sự kiện:</strong>
          <span className="text-[var(--body)] text-[11.5px] leading-normal">{module.eventOutput}</span>
        </div>
      </div>
    </div>
  );
};

// 3. CorePipelineHero (Visual pipeline in center)
interface CorePipelineHeroProps {
  module: typeof aiModules[0];
}

const CorePipelineHero: React.FC<CorePipelineHeroProps> = ({ module }) => {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] p-3">
      <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1.5">
        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Core Pilot Stack
        </span>
        <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 rounded-full uppercase">
          Khuyến nghị
        </span>
      </div>

      {/* Stack / Pipeline Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-0.5 relative">
        {module.coreStack.map((node, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === module.coreStack.length - 1;
          return (
            <div 
              key={idx} 
              className={cn(
                "relative flex flex-col justify-between items-center text-center rounded-lg p-2 shadow-sm min-h-[80px]",
                isFirst 
                  ? "border border-emerald-500 bg-emerald-500/[0.04] ring-1 ring-emerald-500/10" 
                  : isLast 
                  ? "border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] border-dashed" 
                  : "border border-emerald-500/15 bg-[var(--surface)]"
              )}
            >
              <span className={cn(
                "text-xs font-mono font-bold break-words w-full pb-1 border-b border-[var(--hairline)]",
                isFirst ? "text-emerald-500" : "text-[var(--ink)]"
              )}>
                {node.name}
              </span>
              <span className="text-[10px] text-[var(--mute)] leading-tight mt-1 flex-1 flex items-center justify-center">
                {node.role}
              </span>
              {idx < module.coreStack.length - 1 && (
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-500/70" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. DecisionRationale (Rationale in center)
interface DecisionRationaleProps {
  module: typeof aiModules[0];
}

const DecisionRationale: React.FC<DecisionRationaleProps> = ({ module }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[var(--canvas-soft)] p-3 rounded-xl border border-[var(--hairline)] text-xs">
      <div className="space-y-1">
        <strong className="text-[var(--ink)] flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Vì sao chọn
        </strong>
        <ul className="list-disc pl-4 space-y-0.5 text-[var(--body)] text-[11.5px] leading-relaxed">
          {module.whyChoose.slice(0, 2).map((bullet, bIdx) => (
            <li key={bIdx}>{bullet}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-1">
        <strong className="text-[var(--ink)] flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Cần benchmark tại Gia Lâm
        </strong>
        <ul className="list-disc pl-4 space-y-0.5 text-[var(--body)] text-[11.5px] leading-relaxed">
          {module.benchmarkNotes.slice(0, 2).map((bullet, bIdx) => (
            <li key={bIdx}>{bullet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 5. GuardrailStrip (Lưu ý triển khai strip in center bottom)
interface GuardrailStripProps {
  module: typeof aiModules[0];
}

const GuardrailStrip: React.FC<GuardrailStripProps> = ({ module }) => {
  if (!module.warning) return null;
  const isHighSeverity = module.id === 2 || module.id === 4;

  return (
    <div className="pt-3 border-t border-[var(--hairline)] mt-1">
      <div className={cn(
        "rounded-2xl border px-4 py-3 text-xs leading-relaxed",
        isHighSeverity
          ? "border-red-200 bg-red-50 text-red-900 dark:border-red-500/20 dark:bg-red-500/5 dark:text-[var(--ink)]"
          : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-[var(--ink)]"
      )}>
        <div className="flex gap-3">
          <AlertTriangle className={cn(
            "mt-0.5 size-4 shrink-0",
            isHighSeverity 
              ? "text-red-600 dark:text-red-500" 
              : "text-amber-600 dark:text-amber-500"
          )} />
          <div>
            <p className={cn(
              "font-semibold text-xs uppercase tracking-wider mb-0.5", 
              isHighSeverity 
                ? "text-red-800 dark:text-red-400" 
                : "text-amber-800 dark:text-amber-400"
            )}>
              Lưu ý triển khai
            </p>
            <p className="text-[var(--body)] leading-relaxed font-medium">
              {module.warning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. BenchmarkSidebar (Principles & Compact lists in Right Sidebar)
interface BenchmarkSidebarProps {
  module: typeof aiModules[0];
}

const BenchmarkSidebar: React.FC<BenchmarkSidebarProps> = ({ module }) => {
  return (
    <div className="flex flex-col gap-3.5 h-fit self-start">
      {/* Card 1: Nguyên tắc chọn model & Benchmark */}
      <GlassCard className="border border-[var(--hairline-strong)] p-4 flex flex-col gap-3 h-fit" hoverGlow={false}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--mute)] border-b border-[var(--hairline)] pb-2">
          Nguyên tắc chọn model & Benchmark
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {principles.map((p, idx) => (
            <div key={idx} className="rounded-lg border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2.5 leading-snug">
              <strong className="text-[var(--ink)] block mb-0.5 text-xs">{p.title}</strong>
              <span className="text-[var(--body)] text-[11.5px]">{p.desc}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Card 2: Benchmark phụ (Optional Benchmark) */}
      <GlassCard className="border border-[var(--hairline-strong)] p-4 flex flex-col gap-3 h-fit" hoverGlow={false}>
        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider border-b border-[var(--hairline)] pb-1.5 block">
          🟡 Optional Benchmark (Phương án so sánh)
        </span>
        <div className="space-y-2">
          {module.optionalBenchmarks.slice(0, 2).map((item, idx) => (
            <div key={idx} className="rounded-lg border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1 mb-1">
                <span className="font-bold text-[var(--ink)]">{item.name}</span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 bg-amber-50/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded border border-amber-200 dark:border-amber-500/20 uppercase font-semibold">
                  Benchmark
                </span>
              </div>
              <div className="text-[12px] text-[var(--body)] leading-snug space-y-0.5">
                <p>
                  <strong className="text-[var(--ink)]">Khi nào dùng:</strong> {item.when}
                </p>
                <p>
                  <strong className="text-[var(--ink)]">Lý do:</strong> {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Card 3: R&D sau pilot (Future R&D) */}
      <GlassCard className="border border-[var(--hairline-strong)] p-4 flex flex-col gap-3 h-fit" hoverGlow={false}>
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider border-b border-[var(--hairline)] pb-1.5 block">
          🔵 Future / R&D (Nghiên cứu dài hạn)
        </span>
        <div className="space-y-2">
          {module.futureResearch.slice(0, 1).map((item, idx) => (
            <div key={idx} className="rounded-lg border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-1 mb-1">
                <span className="font-bold text-[var(--ink)]">{item.name}</span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded border border-blue-200 dark:border-blue-500/20 uppercase font-semibold">
                  R&D
                </span>
              </div>
              <div className="text-[12px] text-[var(--body)] leading-snug">
                <p>
                  <strong className="text-[var(--ink)]">Mục tiêu:</strong> {item.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

// Main Export Component
export const AiModelStack: React.FC<SectionProps> = ({ isActive = false }) => {
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const selectedModule = aiModules.find((m) => m.id === activeTabId) || aiModules[0];

  return (
    <SectionShell 
      id="ai-modules" 
      isActive={isActive} 
      contentClassName="max-w-6xl md:max-w-7xl h-full flex flex-col justify-start"
      className="pt-14 pb-4 px-6 md:px-10 lg:px-16"
    >
      {/* Title */}
      <div className="mb-3">
        <TechChapterLabel label="AI MODEL STACK" />
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
          Lớp mô hình AI theo nghiệp vụ
        </h2>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--body)]">
          Danh sách chi tiết các mô hình AI ứng viên (candidates), được đề xuất chạy benchmark thực tế trên dữ liệu camera của nhà máy Gia Lâm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1.4fr)_minmax(340px,0.9fr)] gap-4 flex-1 min-h-0 items-start" data-section-nav-ignore="true">
        {/* LEFT COLUMN: Vertical Module Rail */}
        <ModuleTabs activeTabId={activeTabId} setActiveTabId={setActiveTabId} />

        {/* CENTER COLUMN: Recommendation Stage (unified card) */}
        <div className="flex flex-col min-h-0">
          <GlassCard className="border border-[var(--hairline-strong)] p-4 flex flex-col gap-4" hoverGlow={false}>
            <ModuleBrief module={selectedModule} />
            <CorePipelineHero module={selectedModule} />
            <DecisionRationale module={selectedModule} />
            <GuardrailStrip module={selectedModule} />
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Supporting sidebar with principles and compact candidate lists */}
        <BenchmarkSidebar module={selectedModule} />
      </div>
    </SectionShell>
  );
};
