import React, { useState } from "react";
import { SectionShell } from "../layout/SectionShell";
import { cn } from "../../utils/cn";
import {
  ArrowRight,
  BellRing,
  Cpu,
  HardDrive,
  ListChecks,
  SlidersHorizontal,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

type Tone = "green" | "blue" | "amber" | "violet";

interface OperationalStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  input: string[];
  processing: string[];
  output: string[];
  kpi: string[];
  keyPoint: string;
  tech: string[];
  tone: Tone;
  icon: LucideIcon;
}

const operationalSteps: OperationalStep[] = [
  {
    id: "stream-ingest",
    title: "Thu thập luồng",
    subtitle: "RTSP từ camera IP",
    description: "Nhận luồng RTSP/H.264/H.265 từ camera IP qua VLAN nội bộ.",
    input: ["Camera stream", "Timestamp", "Trạng thái kết nối"],
    processing: ["Kiểm tra endpoint, codec, FPS", "Chuẩn hóa stream đầu vào", "Đồng bộ timestamp"],
    output: ["Stream ổn định", "Metadata camera thô", "Trạng thái kết nối"],
    kpi: ["Stream ổn định 72 giờ", "Không mất kết nối thường xuyên", "Không lệch timestamp camera"],
    keyPoint: "Camera chỉ truyền luồng thô; không xử lý AI tại camera biên.",
    tech: ["RTSP", "H.264/H.265", "ONVIF", "NTP"],
    tone: "green",
    icon: Video,
  },
  {
    id: "gpu-inference",
    title: "Giải mã & suy luận GPU",
    subtitle: "Decode + inference",
    description: "Giải mã video bằng GPU, chạy model AI và tạo metadata đối tượng.",
    input: ["Video frames", "Stream đã chuẩn hóa", "Model đã tối ưu"],
    processing: ["NVDEC decode", "Batching", "TensorRT inference", "Tracking đối tượng"],
    output: ["Class", "BBox", "Confidence", "ObjectId"],
    kpi: ["Latency thấp", "GPU utilization ổn định", "Không drop frame bất thường"],
    keyPoint: "AI model chỉ tạo metadata, chưa quyết định cảnh báo cuối cùng.",
    tech: ["NVDEC", "TensorRT", "Tracking metadata"],
    tone: "blue",
    icon: Cpu,
  },
  {
    id: "rule-filter",
    title: "Bộ lọc Quy tắc",
    subtitle: "Debounce + cooldown",
    description: "Rule Engine xác thực metadata thành sự kiện hợp lệ.",
    input: ["AI metadata", "ROI", "Schedule", "Camera rule"],
    processing: ["Debounce", "Cooldown", "Severity", "Dedupe"],
    output: ["Validated event", "Severity", "Rule result"],
    kpi: ["Giảm false alarm", "Không tạo alert spam", "Rule xử lý ổn định"],
    keyPoint: "Rule Engine là lớp quyết định nghiệp vụ.",
    tech: ["ROI", "Debounce", "Cooldown", "Rule Engine"],
    tone: "amber",
    icon: SlidersHorizontal,
  },
  {
    id: "evidence-store",
    title: "Lưu trữ bằng chứng",
    subtitle: "Video, clip, metadata",
    description: "Gắn event với snapshot, clip, metadata và audit log.",
    input: ["Validated event", "Snapshot", "Clip", "Metadata"],
    processing: ["Lưu metadata", "Lưu object evidence", "Gắn audit trail"],
    output: ["Evidence package", "Event record", "Audit log"],
    kpi: ["Truy xuất được event", "Truy xuất được clip", "Có audit khi kiểm chứng"],
    keyPoint: "Evidence-first: cảnh báo quan trọng phải có snapshot/clip/audit.",
    tech: ["PostgreSQL", "MinIO", "NAS", "Audit log"],
    tone: "violet",
    icon: HardDrive,
  },
  {
    id: "dashboard-alert",
    title: "Giao diện & Cảnh báo",
    subtitle: "Dashboard + notification",
    description: "Hiển thị event cho người vận hành và gửi cảnh báo phù hợp.",
    input: ["Validated event", "Evidence package", "Alert status"],
    processing: ["Dashboard review", "Notification routing", "Status tracking"],
    output: ["Dashboard item", "Notification", "Review result"],
    kpi: ["Cảnh báo đến đúng người", "Trạng thái gửi được ghi nhận", "Thao tác được truy vết"],
    keyPoint: "Người vận hành xác nhận và xử lý; hệ thống phải truy vết được thao tác.",
    tech: ["Dashboard", "Notification Gateway", "Review", "Audit"],
    tone: "blue",
    icon: BellRing,
  },
];

export const HowItWorks: React.FC<SectionProps> = ({ isActive = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = operationalSteps[activeIndex];

  return (
    <SectionShell
      id="how-it-works"
      isActive={isActive}
      contentClassName="max-w-7xl h-full flex flex-col"
      className="pt-16 pb-5 px-6 md:px-10 lg:px-16"
    >
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
          OPERATIONAL FLOW
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Nguyên Lý Hoạt Động
        </h2>
        <p className="mt-1 max-w-5xl text-sm leading-relaxed text-[var(--body)]">
          Quy trình xử lý một sự kiện từ luồng camera đến xác thực, lưu bằng
          chứng và phát cảnh báo.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <OperationalFlowHero activeIndex={activeIndex} onSelect={setActiveIndex} />
        <ActiveStageDetails activeStep={activeStep} activeIndex={activeIndex} />
      </div>
    </SectionShell>
  );
};

function OperationalFlowHero({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
            Event lifecycle
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">
            Từ luồng camera đến alert có bằng chứng
          </h3>
        </div>
        <span className="hidden rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-3 py-1 font-mono text-xs font-semibold text-[var(--body)] md:inline-flex">
          Click stage để xem chi tiết
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {operationalSteps.map((step, index) => (
          <OperationalStageNode
            key={step.id}
            index={index}
            step={step}
            isActive={activeIndex === index}
            showArrow={index < operationalSteps.length - 1}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </section>
  );
}

function OperationalStageNode({
  index,
  step,
  isActive,
  showArrow,
  onSelect,
}: {
  index: number;
  step: OperationalStep;
  isActive: boolean;
  showArrow: boolean;
  onSelect: () => void;
}) {
  const Icon = step.icon;
  const toneStyle = toneStyles[step.tone];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex min-h-[168px] flex-col rounded-[var(--radius-card)] border p-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] hover:-translate-y-0.5 hover:shadow-sm",
        toneStyle.node,
        isActive && toneStyle.active
      )}
    >
      {isActive && (
        <span className={cn("absolute inset-x-4 top-0 h-0.5 rounded-full", toneStyle.accent)} />
      )}
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-pill)] transition-all duration-200",
            toneStyle.icon,
            isActive && "scale-105 ring-2"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span
          className={cn(
            "rounded-[var(--radius-pill)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase transition-all duration-200",
            toneStyle.badge,
            isActive && "scale-105 ring-2"
          )}
        >
          0{index + 1}
        </span>
      </div>

      <h4 className="text-[15px] font-semibold leading-tight text-[var(--ink)]">
        {step.title}
      </h4>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--mute)]">
        {step.subtitle}
      </p>
      <p className="mt-2 text-xs leading-snug text-[var(--body)]">
        {step.description}
      </p>

      {showArrow ? (
        <div
          className={cn(
            "absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-[var(--surface)] p-1 xl:block transition-all duration-200",
            isActive ? toneStyle.arrow : "border-[var(--hairline)] text-[var(--mute)]"
          )}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      ) : null}
    </button>
  );
}

function ActiveStageDetails({
  activeStep,
  activeIndex,
}: {
  activeStep: OperationalStep;
  activeIndex: number;
}) {
  const Icon = activeStep.icon;
  const toneStyle = toneStyles[activeStep.tone];

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-pill)]",
              toneStyle.icon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-[var(--radius-pill)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase",
                  toneStyle.badge
                )}
              >
                Stage 0{activeIndex + 1}
              </span>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
                detail
              </p>
            </div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">
              {activeStep.title}
            </h3>
            <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--body)]">
              {activeStep.description}
            </p>
          </div>
        </div>
        <StageTechPills tech={activeStep.tech} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StageInfoCard title="Đầu vào" items={activeStep.input} tone="blue" />
        <StageInfoCard title="Xử lý chính" items={activeStep.processing} tone="green" />
        <StageInfoCard title="Đầu ra" items={activeStep.output} tone="violet" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.2fr]">
        <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
          <div className="mb-2 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold text-[var(--ink)]">KPI kiểm tra</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeStep.kpi.map((item) => (
              <span
                key={item}
                className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] px-2.5 py-1 font-mono text-[11px] font-semibold leading-tight text-[var(--body)]"
              >
                {item}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-amber-500/25 bg-amber-500/[0.045] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
            Điểm mấu chốt vận hành
          </p>
          <p className="mt-1 text-sm leading-snug text-[var(--ink)]">
            {activeStep.keyPoint}
          </p>
        </article>
      </div>
    </section>
  );
}

function StageInfoCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: Tone;
}) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
      <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", titleClass(tone))}>
        {title}
      </p>
      <div className="mt-2 grid gap-1.5">
        {items.map((item) => (
          <p key={item} className="text-xs leading-snug text-[var(--body)]">
            {item}
          </p>
        ))}
      </div>
    </article>
  );
}

function StageTechPills({ tech }: { tech: string[] }) {
  return (
    <div className="flex max-w-lg flex-wrap justify-start gap-1.5 md:justify-end">
      {tech.map((item) => (
        <span
          key={item}
          className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2.5 py-1 text-[11px] font-semibold leading-tight text-[var(--body)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const toneStyles: Record<
  Tone,
  {
    node: string;
    active: string;
    icon: string;
    badge: string;
    accent: string;
    arrow: string;
  }
> = {
  green: {
    node:
      "border-emerald-500/20 bg-emerald-500/[0.075] text-emerald-600 dark:border-emerald-400/25 dark:bg-emerald-400/[0.09] dark:text-emerald-300",
    active:
      "border-2 border-emerald-400 ring-2 ring-emerald-200/90 shadow-[0_14px_34px_rgba(16,185,129,0.18)] dark:border-emerald-400/70 dark:ring-emerald-400/25 dark:shadow-[0_14px_34px_rgba(16,185,129,0.12)]",
    icon:
      "border border-current/20 bg-current/5 text-emerald-600 dark:text-emerald-300",
    badge:
      "border border-current/20 bg-current/5 text-emerald-600 dark:text-emerald-300",
    accent: "bg-emerald-500",
    arrow: "border-emerald-300/50 text-emerald-600/80 dark:border-emerald-400/30 dark:text-emerald-400/80",
  },
  blue: {
    node:
      "border-blue-500/20 bg-blue-500/[0.065] text-blue-600 dark:border-blue-400/25 dark:bg-blue-400/[0.085] dark:text-blue-300",
    active:
      "border-2 border-blue-400 ring-2 ring-blue-200/90 shadow-[0_14px_34px_rgba(59,130,246,0.18)] dark:border-blue-400/70 dark:ring-blue-400/25 dark:shadow-[0_14px_34px_rgba(59,130,246,0.12)]",
    icon:
      "border border-current/20 bg-current/5 text-blue-600 dark:text-blue-300",
    badge:
      "border border-current/20 bg-current/5 text-blue-600 dark:text-blue-300",
    accent: "bg-blue-500",
    arrow: "border-blue-300/50 text-blue-600/80 dark:border-blue-400/30 dark:text-blue-400/80",
  },
  amber: {
    node:
      "border-amber-500/25 bg-amber-500/[0.075] text-amber-600 dark:border-amber-400/25 dark:bg-amber-400/[0.09] dark:text-amber-300",
    active:
      "border-2 border-amber-400 ring-2 ring-amber-200/90 shadow-[0_14px_34px_rgba(245,158,11,0.18)] dark:border-amber-400/70 dark:ring-amber-400/25 dark:shadow-[0_14px_34px_rgba(245,158,11,0.12)]",
    icon:
      "border border-current/20 bg-current/5 text-amber-600 dark:text-amber-300",
    badge:
      "border border-current/20 bg-current/5 text-amber-600 dark:text-amber-300",
    accent: "bg-amber-500",
    arrow: "border-amber-300/50 text-amber-600/80 dark:border-amber-400/30 dark:text-amber-400/80",
  },
  violet: {
    node:
      "border-violet-500/20 bg-violet-500/[0.065] text-violet-600 dark:border-violet-400/25 dark:bg-violet-400/[0.085] dark:text-violet-300",
    active:
      "border-2 border-violet-400 ring-2 ring-violet-200/90 shadow-[0_14px_34px_rgba(139,92,246,0.18)] dark:border-violet-400/70 dark:ring-violet-400/25 dark:shadow-[0_14px_34px_rgba(139,92,246,0.12)]",
    icon:
      "border border-current/20 bg-current/5 text-violet-600 dark:text-violet-300",
    badge:
      "border border-current/20 bg-current/5 text-violet-600 dark:text-violet-300",
    accent: "bg-violet-500",
    arrow: "border-violet-300/50 text-violet-600/80 dark:border-violet-400/30 dark:text-violet-400/80",
  },
};

function titleClass(tone: Tone) {
  if (tone === "green") return "text-emerald-600";
  if (tone === "blue") return "text-blue-600";
  if (tone === "amber") return "text-amber-600";
  if (tone === "violet") return "text-violet-600";
  return "text-[var(--ink)]";
}
