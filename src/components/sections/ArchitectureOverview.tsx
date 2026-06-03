import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { TechChapterLabel } from "../ui/TechChapter";
import { cn } from "../../utils/cn";
import {
  Brain,
  Camera,
  Cpu,
  Database,
  MonitorCheck,
  Network,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

type Tone = "neutral" | "green" | "blue" | "violet" | "greenBlue" | "amber";

interface ArchitectureLayer {
  title: string;
  responsibility: string;
  owns: string[];
  hint: string;
  tone: Tone;
  icon: LucideIcon;
}

interface SupportPanel {
  title: string;
  tone: Tone;
  items: string[];
  note?: string;
}

const decisionChips: Array<{ label: string; tone: Tone }> = [
  { label: "Pilot: 18 camera", tone: "neutral" },
  { label: "Camera VLAN + RTSP/ONVIF", tone: "green" },
  { label: "GPU inference + TensorRT", tone: "violet" },
  { label: "Evidence-first architecture", tone: "amber" },
];

const architectureBlueprintLayers: ArchitectureLayer[] = [
  {
    title: "Edge & Network Layer",
    responsibility: "Nguồn video, kết nối ổn định và cô lập mạng camera.",
    owns: ["Camera IP", "RTSP/ONVIF", "VLAN", "PoE", "NTP"],
    hint: "Foundation",
    tone: "green",
    icon: Camera,
  },
  {
    title: "Compute & GPU Layer",
    responsibility: "Giải mã nhiều luồng video và chạy inference realtime trên AI Server.",
    owns: ["AI Server", "GPU", "NVDEC", "DeepStream", "TensorRT"],
    hint: "Realtime",
    tone: "blue",
    icon: Cpu,
  },
  {
    title: "AI Model Layer",
    responsibility: "Sinh metadata nghiệp vụ: object, confidence, face embedding và tracking.",
    owns: ["YOLO candidates", "PPE", "Fire/Smoke", "SCRFD", "ArcFace", "Milvus"],
    hint: "Metadata",
    tone: "violet",
    icon: Brain,
  },
  {
    title: "Application & Data Layer",
    responsibility: "Quyết định event, lưu metadata, snapshot, clip và audit log.",
    owns: ["FastAPI", "Rule Engine", "PostgreSQL", "MinIO", "NAS RAID 6"],
    hint: "Event + Evidence",
    tone: "greenBlue",
    icon: Database,
  },
  {
    title: "Operations & Security Layer",
    responsibility: "Vận hành, cảnh báo, giám sát, phân quyền và khôi phục.",
    owns: ["Dashboard", "Notification", "Prometheus", "Grafana", "RBAC", "Backup"],
    hint: "Operations",
    tone: "amber",
    icon: MonitorCheck,
  },
];

const supportPanels: SupportPanel[] = [
  {
    title: "Core Pilot Stack",
    tone: "green",
    items: [
      "Camera VLAN + Managed PoE",
      "AI Server GPU + DeepStream/TensorRT",
      "FastAPI + PostgreSQL + MinIO + NAS",
      "Dashboard + Notification + Audit",
    ],
  },
  {
    title: "Scale Later",
    tone: "blue",
    note: "Không phải mặc định cho pilot; chỉ thêm khi quy mô hoặc yêu cầu bảo mật tăng.",
    items: ["NATS JetStream / Redis", "ClickHouse", "Kafka / Kubernetes", "Keycloak / SIEM"],
  },
  {
    title: "Nguyên tắc kiến trúc",
    tone: "neutral",
    items: [
      "Tách mạng camera khỏi mạng văn phòng",
      "Rule Engine quyết định event, model AI chỉ sinh metadata",
      "Evidence-first: cảnh báo cần snapshot/clip/audit",
      "RAID không thay thế backup độc lập",
      "Docker Compose trước, scale sau",
    ],
  },
];

export const ArchitectureOverview: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  return (
    <SectionShell
      id="architecture-overview"
      isActive={isActive}
      contentClassName="max-w-7xl h-full flex flex-col"
      className="pt-16 pb-5 px-6 md:px-10 lg:px-16"
    >
      <div className="mb-3">
        <TechChapterLabel index={2} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Tổng Quan Kiến Trúc
        </h2>
        <p className="mt-1 max-w-5xl text-sm leading-relaxed text-[var(--body)]">
          Bản đồ các tầng công nghệ, trách nhiệm từng tầng và hướng triển khai
          pilot/mở rộng.
        </p>
        <ArchitectureDecisionChips />
      </div>

      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <ArchitectureBlueprint />
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {supportPanels.map((panel) => (
            <ArchitectureSupportPanel key={panel.title} panel={panel} />
          ))}
        </section>
      </div>
    </SectionShell>
  );
};

function ArchitectureDecisionChips() {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {decisionChips.map((chip) => (
        <span
          key={chip.label}
          className={cn(
            "rounded-[var(--radius-pill)] border px-3 py-1 text-xs font-semibold",
            toneClasses(chip.tone)
          )}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function ArchitectureBlueprint() {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
            Architecture Layer Blueprint
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">
            Tầng nào sở hữu phần nào của hệ thống
          </h3>
          <p className="mt-1 max-w-5xl text-sm leading-relaxed text-[var(--body)]">
            Blueprint này mô tả ownership công nghệ và ranh giới trách nhiệm,
            không phải luồng xử lý một event.
          </p>
        </div>
        <span className="hidden rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-3 py-1 font-mono text-xs font-semibold text-[var(--body)] md:inline-flex">
          System map
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
        {architectureBlueprintLayers.slice(0, 3).map((layer) => (
          <ArchitectureLayerCard
            key={layer.title}
            layer={layer}
            className="lg:col-span-2"
          />
        ))}
        {architectureBlueprintLayers.slice(3).map((layer) => (
          <ArchitectureLayerCard
            key={layer.title}
            layer={layer}
            className="lg:col-span-2"
          />
        ))}
        <SystemBoundaryNote />
      </div>
    </section>
  );
}

function ArchitectureLayerCard({
  layer,
  className,
}: {
  layer: ArchitectureLayer;
  className?: string;
}) {
  const Icon = layer.icon;

  return (
    <article
      className={cn(
        "rounded-[var(--radius-card)] border p-3.5",
        toneClasses(layer.tone),
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-pill)] border border-current/20 bg-current/5">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <span className="rounded-[var(--radius-pill)] border border-current/20 bg-current/5 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase">
          {layer.hint}
        </span>
      </div>
      <h4 className="text-[15px] font-semibold leading-tight text-[var(--ink)]">
        {layer.title}
      </h4>
      <p className="mt-2 text-xs leading-snug text-[var(--body)]">
        {layer.responsibility}
      </p>
      <ArchitectureOwnershipPills owns={layer.owns} />
    </article>
  );
}

function ArchitectureOwnershipPills({ owns }: { owns: string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {owns.map((item) => (
        <span
          key={item}
          className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-semibold leading-tight text-[var(--body)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SystemBoundaryNote() {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3.5 lg:col-span-2">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink)]">
          <Network className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">
            System ownership / boundary
          </p>
          <p className="text-[11px] font-mono text-[var(--mute)]">
            Pilot first, scale later
          </p>
        </div>
      </div>
      <p className="text-xs leading-snug text-[var(--body)]">
        Pilot Gia Lâm ưu tiên hệ thống on-premise rõ ranh giới: camera/network,
        AI Server, application/data và operations. Các bus, cache, analytics lớn
        hoặc IAM nâng cao chỉ thêm khi quy mô hoặc yêu cầu bảo mật tăng.
      </p>
    </article>
  );
}

function ArchitectureSupportPanel({ panel }: { panel: SupportPanel }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-sm font-semibold leading-tight", supportTitleClass(panel.tone))}>
            {panel.title}
          </p>
          {panel.note ? (
            <p className="mt-1 text-[11px] font-medium leading-snug text-[var(--mute)]">
              {panel.note}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-pill)] border",
            toneClasses(panel.tone)
          )}
        >
          <ShieldCheck className="h-4 w-4" />
        </span>
      </div>

      <div className="grid gap-1.5">
        {panel.items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                dotClass(panel.tone)
              )}
            />
            <p className="text-xs leading-snug text-[var(--body)]">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function toneClasses(tone: Tone) {
  if (tone === "green") return "border-emerald-500/20 bg-emerald-500/[0.045] text-emerald-600";
  if (tone === "blue") return "border-blue-500/20 bg-blue-500/[0.035] text-blue-600";
  if (tone === "violet") return "border-violet-500/20 bg-violet-500/[0.035] text-violet-600";
  if (tone === "greenBlue") return "border-teal-500/20 bg-teal-500/[0.035] text-teal-600";
  if (tone === "amber") return "border-amber-500/25 bg-amber-500/[0.045] text-amber-600";
  return "border-[var(--hairline)] bg-[var(--canvas-soft)] text-[var(--body)]";
}

function supportTitleClass(tone: Tone) {
  if (tone === "green") return "text-emerald-600";
  if (tone === "blue") return "text-blue-600";
  if (tone === "violet") return "text-violet-600";
  if (tone === "greenBlue") return "text-teal-600";
  if (tone === "amber") return "text-amber-600";
  return "text-[var(--ink)]";
}

function dotClass(tone: Tone) {
  if (tone === "green") return "bg-emerald-500";
  if (tone === "blue") return "bg-blue-500";
  if (tone === "violet") return "bg-violet-500";
  if (tone === "greenBlue") return "bg-teal-500";
  if (tone === "amber") return "bg-amber-500";
  return "bg-[var(--mute)]";
}
