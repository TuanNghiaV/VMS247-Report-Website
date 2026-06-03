import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { TechChapterLabel } from "../ui/TechChapter";
import { cn } from "../../utils/cn";
import {
  ArrowRight,
  Bell,
  Database,
  FileCheck2,
  HardDrive,
  MonitorCheck,
  SlidersHorizontal,
  Workflow,
} from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

const decisionChips = [
  "Pilot: FastAPI + PostgreSQL + MinIO + NAS",
  "Evidence-first: Event + Snapshot + Audit",
  "Scale later: NATS / Redis / ClickHouse / K8S",
];

const pipelineNodes = [
  {
    title: "AI Metadata",
    description: "cameraId, timestamp, objectId, confidence",
    badge: "Input",
    tone: "blue" as const,
    icon: Workflow,
  },
  {
    title: "Rule Engine",
    description: "debounce, cooldown, severity, ROI",
    badge: "Business logic",
    tone: "green" as const,
    icon: SlidersHorizontal,
  },
  {
    title: "Event Service",
    description: "event contract, dedupe, status",
    badge: "Event",
    tone: "green" as const,
    icon: FileCheck2,
  },
  {
    title: "Evidence Store",
    description: "PostgreSQL + MinIO + NAS RAID 6",
    badge: "Storage",
    tone: "violet" as const,
    icon: HardDrive,
  },
  {
    title: "Notification Gateway",
    description: "Zalo / SMS / Email, retry, delivery status",
    badge: "Alert",
    tone: "amber" as const,
    icon: Bell,
  },
  {
    title: "Dashboard / Review",
    description: "search, playback, audit, report",
    badge: "User layer",
    tone: "neutral" as const,
    icon: MonitorCheck,
  },
];

const ruleChips = [
  ["Multi-frame confirm", "Xác nhận nhiều frame"],
  ["Debounce", "Tránh báo giả tức thời"],
  ["Cooldown", "Chặn cảnh báo lặp"],
  ["Severity", "Gán mức độ ưu tiên"],
  ["Dedupe", "Gộp event trùng"],
  ["Schedule", "Theo ca/khung giờ"],
  ["ROI / Camera", "Rule theo vùng/camera"],
  ["Evidence binding", "Gắn snapshot/clip/audit"],
];

const dataRows = [
  ["PostgreSQL", "Metadata: camera, rule, event, user, audit log"],
  ["MinIO", "Object evidence: snapshot, clip ngắn, file bằng chứng"],
  ["NAS RAID 6", "Video retention 24/7, lưu dài ngày, chịu lỗi ổ cứng. Không thay thế backup độc lập."],
  ["Notification Gateway", "Alert delivery, retry, trạng thái gửi thành công/thất bại"],
];

export const BackendDataStack: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  return (
    <SectionShell id="backend-data-stack" isActive={isActive} contentClassName="max-w-7xl">
      <div className="mb-3">
        <TechChapterLabel index={5} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Backend, Rule Engine &amp; Lưu trữ dữ liệu
        </h2>
        <p className="mt-1 max-w-5xl text-sm leading-relaxed text-[var(--body)]">
          Tầng nghiệp vụ chuyển metadata từ AI thành sự kiện, cảnh báo, bằng chứng và dữ liệu vận hành.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {decisionChips.map((chip, index) => (
            <span
              key={chip}
              className={cn(
                "rounded-[var(--radius-pill)] border px-3 py-1 text-xs font-semibold",
                index === 0 && "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
                index === 1 && "border-violet-500/20 bg-violet-500/5 text-violet-600",
                index === 2 && "border-blue-500/20 bg-blue-500/5 text-blue-600"
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4" data-section-nav-ignore="true">
        <BackendPipelineHero />
        <SupportGrid />
      </div>
    </SectionShell>
  );
};

function BackendPipelineHero() {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
            Backend architecture blueprint
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">
            Luồng backend từ AI metadata đến bằng chứng
          </h3>
          <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--body)]">
            Rule Engine xác thực metadata AI, tạo event hợp lệ, gắn bằng chứng và phát cảnh báo đến dashboard.
          </p>
        </div>
        <span className="hidden rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-3 py-1 font-mono text-xs font-semibold text-[var(--body)] md:inline-flex">
          Event-driven core
        </span>
      </div>

      <div className="grid grid-cols-6 gap-3">
        {pipelineNodes.map((node, index) => {
          const Icon = node.icon;

          return (
            <div
              key={node.title}
              className={cn(
                "relative min-h-[132px] rounded-[var(--radius-card)] border p-3.5",
                toneClasses(node.tone)
              )}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-pill)] border border-current/20 bg-current/5">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="rounded-[var(--radius-pill)] border border-current/20 bg-current/5 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase">
                      {node.badge}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-semibold leading-tight text-[var(--ink)]">
                    {node.title}
                  </h4>
                </div>
                <p className="mt-3 text-xs leading-snug text-[var(--body)]">
                  {node.description}
                </p>
              </div>

              {index < pipelineNodes.length - 1 ? (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] p-1 text-[var(--mute)] xl:block">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-4 py-2.5 font-mono">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[var(--ink)]">
          {["cameraId", "timestamp", "objectId", "ruleId", "severity", "evidenceUrl", "auditId"].map((field, index) => (
            <React.Fragment key={field}>
              <span>{field}</span>
              {index < 6 ? <span className="text-[var(--mute)]">•</span> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportGrid() {
  return (
    <section className="grid grid-cols-3 gap-4">
      <RuleEngineConsole />
      <DataResponsibility />
      <PilotScaleDecision />
    </section>
  );
}

function RuleEngineConsole() {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          Rule Engine nghiệp vụ
        </h3>
        <p className="mt-1 text-xs leading-snug text-[var(--body)]">
          Chuyển AI metadata thành event hợp lệ bằng rule theo vùng/camera.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ruleChips.map(([title, desc]) => (
          <div
            key={title}
            className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2"
          >
            <p className="font-mono text-[11px] font-semibold leading-tight text-[var(--ink)]">
              {title}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-[var(--body)]">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function DataResponsibility() {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Database className="h-4 w-4 text-[var(--ink)]" />
        <h3 className="text-sm font-semibold text-[var(--ink)]">
          Trách nhiệm dữ liệu
        </h3>
      </div>
      <div className="space-y-2">
        {dataRows.map(([name, desc]) => (
          <div
            key={name}
            className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2.5"
          >
            <p className="text-sm font-semibold leading-tight text-[var(--ink)]">
              {name}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-[var(--body)]">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function PilotScaleDecision() {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-4">
      <h3 className="text-sm font-semibold text-[var(--ink)]">
        Khuyến nghị triển khai
      </h3>

      <div className="mt-3 space-y-3">
        <div className="rounded-[var(--radius-card)] border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
          <p className="text-sm font-semibold text-emerald-600">
            Pilot Gia Lâm
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--body)]">
            FastAPI + PostgreSQL + MinIO + NAS RAID 6 là đủ để chạy pilot 18 camera. Ưu tiên event, evidence, audit log và vận hành ổn định.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-blue-500/20 bg-blue-500/[0.035] p-3">
          <p className="text-sm font-semibold text-blue-600">
            Scale sau
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--body)]">
            Chỉ thêm NATS JetStream, Redis, ClickHouse, Kafka hoặc Kubernetes khi số camera/site tăng, cần event bus, cache hoặc analytics lớn.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
          Docker Compose first
        </span>
        <span className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
          Modular service design
        </span>
      </div>
    </article>
  );
}

function toneClasses(tone: (typeof pipelineNodes)[number]["tone"]) {
  if (tone === "blue") {
    return "border-blue-500/20 bg-blue-500/[0.035] text-blue-600";
  }
  if (tone === "green") {
    return "border-emerald-500/25 bg-emerald-500/[0.045] text-emerald-600";
  }
  if (tone === "violet") {
    return "border-violet-500/20 bg-violet-500/[0.035] text-violet-600";
  }
  if (tone === "amber") {
    return "border-amber-500/25 bg-amber-500/[0.045] text-amber-600";
  }
  return "border-[var(--hairline)] bg-[var(--surface-soft)] text-[var(--mute)]";
}
