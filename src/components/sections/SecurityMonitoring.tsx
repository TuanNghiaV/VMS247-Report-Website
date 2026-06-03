import React, { useState } from "react";
import { SectionShell } from "../layout/SectionShell";
import { TechChapterLabel } from "../ui/TechChapter";
import { cn } from "../../utils/cn";
import {
  Activity,
  AlertTriangle,
  ArchiveRestore,
  Check,
  CircleDot,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

type ControlKey = "metrics" | "rbac" | "backup" | "hardening";
type Permission = "yes" | "limited" | "no";

const decisionChips = [
  "Pilot: RBAC đơn giản + audit log",
  "Monitoring: Prometheus + Grafana",
  "Backup: mã hóa + restore drill",
  "Scale later: Keycloak / SIEM",
];

const controls: Array<{
  key: ControlKey;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  rightHighlightTitle: string;
  rightHighlightText: string;
}> = [
  {
    key: "metrics",
    title: "Chỉ số giám sát",
    subtitle: "Camera / GPU / NAS / Event",
    icon: Activity,
    rightHighlightTitle: "Ưu tiên giám sát",
    rightHighlightText: "Cảnh báo sớm camera offline, NAS gần đầy, GPU quá tải và độ trễ notification.",
  },
  {
    key: "rbac",
    title: "RBAC & audit trail",
    subtitle: "Vai trò / quyền / lịch sử",
    icon: LockKeyhole,
    rightHighlightTitle: "Ưu tiên truy vết",
    rightHighlightText: "Log đầy đủ thao tác login, xem sự kiện, sửa rule, export evidence và backup job.",
  },
  {
    key: "backup",
    title: "Backup & restore",
    subtitle: "DB / config / model / evidence",
    icon: ArchiveRestore,
    rightHighlightTitle: "Ưu tiên khôi phục",
    rightHighlightText: "Có file backup chưa đủ; cần restore drill định kỳ để chứng minh hệ thống khôi phục được.",
  },
  {
    key: "hardening",
    title: "Pilot hardening",
    subtitle: "Gia Lâm first controls",
    icon: ServerCog,
    rightHighlightTitle: "Ưu tiên nghiệm thu",
    rightHighlightText: "Hoàn tất tài khoản theo vai trò, audit log, health dashboard, backup mã hóa và restore drill trước khi mở rộng.",
  },
];

const metricGroups: Array<[string, string[]]> = [
  ["Camera", ["online/offline", "RTSP reconnect", "FPS", "timestamp drift"]],
  ["AI / GPU", ["inference latency", "GPU utilization", "VRAM", "dropped frames"]],
  ["Server", ["CPU/RAM", "disk I/O", "container status"]],
  ["NAS", ["capacity", "SMART", "RAID status", "write speed"]],
  ["Event / Notification", ["alert count", "false alarm review", "queue delay", "delivery success"]],
  ["Backup / Security", ["backup status", "restore check", "login audit", "failed attempts"]],
];

const permissionColumns = [
  "Live view",
  "Event review",
  "Rule config",
  "User/admin",
  "Face attendance",
  "Export evidence",
  "Backup/restore",
];

const roleRows: Array<{
  role: string;
  permissions: Permission[];
  note: string;
}> = [
  {
    role: "IT Administrator",
    permissions: ["yes", "yes", "yes", "yes", "limited", "yes", "yes"],
    note: "Quản trị hệ thống, phân quyền, backup và vận hành nền tảng.",
  },
  {
    role: "Security Operator",
    permissions: ["yes", "yes", "no", "no", "no", "limited", "no"],
    note: "Giám sát live view, xử lý cảnh báo an ninh và review event.",
  },
  {
    role: "HSE Manager",
    permissions: ["limited", "limited", "limited", "no", "no", "limited", "no"],
    note: "Tập trung PPE/safety events và rule an toàn theo khu vực.",
  },
  {
    role: "HR Officer",
    permissions: ["no", "limited", "no", "no", "yes", "limited", "no"],
    note: "Chỉ xem dữ liệu chấm công/khuôn mặt trong phạm vi được duyệt.",
  },
];

const backupScopes = [
  ["Database", "camera, rule, user, event, audit"],
  ["Config", "camera config, ROI, thresholds"],
  ["Model", "TensorRT engine, labels, version"],
  ["Evidence", "snapshot/clip metadata, critical files"],
];

const hardeningGroups = [
  {
    title: "Bắt buộc trước nghiệm thu",
    items: [
      "Tài khoản theo vai trò, không dùng chung account",
      "Bật audit log cho login, rule edit, export evidence",
      "Dashboard sức khỏe camera/GPU/NAS",
      "Backup mã hóa định kỳ",
      "Diễn tập restore trước nghiệm thu",
    ],
  },
  {
    title: "Bổ sung sau pilot",
    items: [
      "Cảnh báo camera offline / NAS gần đầy / GPU quá tải",
      "Chính sách riêng cho dữ liệu khuôn mặt nếu bật chấm công",
      "Keycloak / SIEM / SSO nếu quy mô hoặc yêu cầu bảo mật tăng",
    ],
  },
];

const pilotRecommendations = [
  ["Bắt đầu vừa đủ", "RBAC đơn giản, audit log, health dashboard và backup mã hóa."],
  ["Không over-engineer", "Keycloak/SIEM/Kafka/K8S chỉ thêm khi quy mô hoặc yêu cầu bảo mật tăng."],
  ["Backup phải kiểm thử", "Có backup chưa đủ; cần restore drill định kỳ."],
  ["Dữ liệu nhạy cảm", "Face attendance cần phân quyền, retention và audit log riêng."],
];

export const SecurityMonitoring: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const [activeControl, setActiveControl] = useState<ControlKey>("metrics");

  return (
    <SectionShell id="security-monitoring" isActive={isActive} contentClassName="max-w-7xl">
      <div className="mb-3">
        <TechChapterLabel index={6} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Bảo mật, giám sát &amp; kiểm soát vận hành
        </h2>
        <p className="mt-1 max-w-5xl text-sm leading-relaxed text-[var(--body)]">
          Theo dõi sức khỏe camera/server/GPU/NAS, phân quyền truy cập, audit log và backup.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {decisionChips.map((chip, index) => (
            <span
              key={chip}
              className={cn(
                "rounded-[var(--radius-pill)] border px-3 py-1 text-xs font-semibold",
                index === 0 && "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
                index === 1 && "border-blue-500/20 bg-blue-500/5 text-blue-600",
                index === 2 && "border-violet-500/20 bg-violet-500/5 text-violet-600",
                index === 3 && "border-amber-500/20 bg-amber-500/5 text-amber-600"
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div
        className="grid flex-1 grid-cols-1 items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)_340px]"
        data-section-nav-ignore="true"
      >
        <ControlRail activeControl={activeControl} onSelect={setActiveControl} />
        <ActiveOperationsPanel activeControl={activeControl} />
        <PilotGuardrails activeControl={activeControl} />
      </div>
    </SectionShell>
  );
};

function ControlRail({
  activeControl,
  onSelect,
}: {
  activeControl: ControlKey;
  onSelect: (key: ControlKey) => void;
}) {
  return (
    <aside className="flex flex-col gap-2.5">
      <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
        Control center
      </p>
      {controls.map((control) => {
        const Icon = control.icon;
        const active = activeControl === control.key;

        return (
          <button
            key={control.key}
            type="button"
            onClick={() => onSelect(control.key)}
            className={cn(
              "relative overflow-hidden rounded-[var(--radius-card)] border p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
              active
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)] shadow-sm ring-1 ring-emerald-400/20"
                : "border-[var(--hairline)] bg-[var(--surface)] text-[var(--body)] hover:border-[var(--hairline-strong)] hover:bg-[var(--surface-soft)]"
            )}
          >
            <span
              className={cn(
                "absolute bottom-0 left-0 top-0 w-1",
                active ? "bg-emerald-400" : "bg-transparent"
              )}
            />
            {active ? (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.18)]" />
            ) : null}
            <div className="flex gap-3 pl-1">
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-pill)] border",
                  active
                    ? "border-white/25 bg-white text-black shadow-sm"
                    : "border-[var(--hairline)] bg-[var(--canvas-soft)] text-[var(--ink)]"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span>
                <span className={cn("block text-sm font-semibold", active ? "text-white" : "text-[var(--ink)]")}>
                  {control.title}
                </span>
                <span className={cn("mt-1 block text-xs leading-snug", active ? "text-white/75" : "text-[var(--body)]")}>
                  {control.subtitle}
                </span>
              </span>
            </div>
          </button>
        );
      })}
    </aside>
  );
}

function ActiveOperationsPanel({ activeControl }: { activeControl: ControlKey }) {
  return (
    <main className="rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-5">
      {activeControl === "metrics" && <MetricsPanel />}
      {activeControl === "rbac" && <RbacPanel />}
      {activeControl === "backup" && <BackupPanel />}
      {activeControl === "hardening" && <HardeningPanel />}
    </main>
  );
}

function MetricsPanel() {
  return (
    <section>
      <PanelHeading
        eyebrow="Monitoring"
        title="Observability map"
        description="Những tín hiệu vận hành cần đo để phát hiện sớm lỗi camera, GPU, NAS, event và backup."
      />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {metricGroups.map(([title, metrics]) => (
          <div
            key={title}
            className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3"
          >
            <h4 className="text-[15px] font-semibold text-[var(--ink)]">{title}</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(metrics as string[]).map((metric) => (
                <span
                  key={metric}
                  className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--body)]"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <FlowStrip items={["Metric", "Prometheus", "Grafana dashboard", "Alert rule", "Notification"]} />
    </section>
  );
}

function RbacPanel() {
  return (
    <section>
      <PanelHeading
        eyebrow="Access control"
        title="RBAC matrix & audit trail"
        description="Pilot dùng phân quyền đơn giản nhưng mọi thao tác nhạy cảm phải truy vết được."
      />
      <RbacLegend />
      <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)]">
        <div className="grid grid-cols-[150px_repeat(7,minmax(0,1fr))] bg-[var(--canvas-soft)] text-[11px] font-semibold text-[var(--mute)]">
          <div className="border-r border-[var(--hairline)] p-2">Role</div>
          {permissionColumns.map((column) => (
            <div key={column} className="border-r border-[var(--hairline)] p-2 text-center last:border-r-0">
              {column}
            </div>
          ))}
        </div>
        {roleRows.map((row) => (
          <div key={row.role} className="grid grid-cols-[150px_repeat(7,minmax(0,1fr))] border-t border-[var(--hairline)]">
            <div className="border-r border-[var(--hairline)] p-2">
              <p className="text-sm font-semibold leading-tight text-[var(--ink)]">{row.role}</p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--body)]">{row.note}</p>
            </div>
            {row.permissions.map((permission, index) => (
              <PermissionCell key={`${row.role}-${permissionColumns[index]}`} value={permission} />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
        <p className="font-mono text-xs font-semibold text-[var(--ink)]">
          login • view event • edit rule • export evidence • delete/restore • backup job
        </p>
        <p className="mt-1 text-sm leading-snug text-[var(--body)]">
          Mọi thao tác nhạy cảm phải có userId, timestamp, action, targetId và result.
        </p>
      </div>
    </section>
  );
}

function RbacLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
        <Check className="h-3.5 w-3.5" />
        Full access
      </span>
      <span className="rounded-[var(--radius-pill)] border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
        Limited
      </span>
      <span className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--canvas-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--mute)]">
        - No access
      </span>
    </div>
  );
}

function PermissionCell({ value }: { value: Permission }) {
  return (
    <div className="grid place-items-center border-r border-[var(--hairline)] p-2 last:border-r-0">
      {value === "yes" ? (
        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
          <Check className="h-3.5 w-3.5" />
        </span>
      ) : value === "limited" ? (
        <span className="rounded-[var(--radius-pill)] border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
          Limited
        </span>
      ) : (
        <span className="text-lg leading-none text-[var(--mute)]">-</span>
      )}
    </div>
  );
}

function BackupPanel() {
  return (
    <section>
      <PanelHeading
        eyebrow="Resilience"
        title="Backup / restore control loop"
        description="Backup chỉ có giá trị khi dữ liệu quan trọng được mã hóa, tách nơi lưu và diễn tập khôi phục định kỳ."
      />
      <FlowStrip
        items={[
          "PostgreSQL DB",
          "Config",
          "AI model",
          "Evidence metadata",
          "Encrypted backup",
          "Restore drill",
          "Audit result",
        ]}
      />
      <RecoveryTargetChips />
      <div className="mt-4 grid grid-cols-4 gap-3">
        {backupScopes.map(([title, desc]) => (
          <div key={title} className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
            <h4 className="text-sm font-semibold text-[var(--ink)]">{title}</h4>
            <p className="mt-1 text-xs leading-snug text-[var(--body)]">{desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-amber-500/25 bg-amber-500/[0.045] p-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm leading-snug text-[var(--body)]">
          RAID không thay thế backup độc lập; cần kiểm thử restore để chứng minh backup dùng được.
        </p>
      </div>
    </section>
  );
}

function RecoveryTargetChips() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-2.5">
      <span className="rounded-[var(--radius-pill)] border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600">
        RPO: chốt sau pilot
      </span>
      <span className="rounded-[var(--radius-pill)] border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
        RTO: chốt sau pilot
      </span>
      <span className="text-xs leading-snug text-[var(--body)]">
        RPO/RTO là mục tiêu mất dữ liệu tối đa và thời gian khôi phục sau sự cố.
      </span>
    </div>
  );
}

function HardeningPanel() {
  return (
    <section>
      <PanelHeading
        eyebrow="Pilot controls"
        title="Gia Lâm pilot hardening checklist"
        description="Bắt đầu bằng các kiểm soát thực dụng, dễ nghiệm thu và trực tiếp giảm rủi ro vận hành."
      />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {hardeningGroups.map((group, groupIndex) => (
          <div key={group.title} className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
            <h4 className={cn(
              "text-sm font-semibold",
              groupIndex === 0 ? "text-emerald-600" : "text-blue-600"
            )}>
              {group.title}
            </h4>
            <div className="mt-2 space-y-2">
              {group.items.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <ShieldCheck className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    groupIndex === 0 ? "text-emerald-600" : "text-blue-600"
                  )} />
                  <p className="text-sm leading-snug text-[var(--body)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PilotGuardrails({ activeControl }: { activeControl: ControlKey }) {
  const highlight = controls.find((control) => control.key === activeControl) ?? controls[0];

  return (
    <aside className="flex h-fit self-start flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--hairline-strong)] bg-[var(--surface)] p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
          Khuyến nghị pilot Gia Lâm
        </p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
          Thực dụng trước, mở rộng sau
        </h3>
      </div>
      <div className="space-y-2.5">
        {pilotRecommendations.map(([title, desc], index) => (
          <div key={title} className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[var(--mute)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
            </div>
            <p className="mt-1 text-xs leading-snug text-[var(--body)]">{desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[var(--radius-card)] border border-emerald-500/20 bg-emerald-500/[0.045] p-3">
        <p className="text-sm font-semibold text-emerald-600">
          {highlight.rightHighlightTitle}
        </p>
        <p className="mt-1 text-xs leading-snug text-[var(--body)]">
          {highlight.rightHighlightText}
        </p>
      </div>
    </aside>
  );
}

function PanelHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mute)]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-[var(--body)]">
        {description}
      </p>
    </div>
  );
}

function FlowStrip({ items }: { items: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3">
      {items.map((item, index) => (
        <React.Fragment key={`${item}-${index}`}>
          <span className="rounded-[var(--radius-pill)] border border-[var(--hairline)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]">
            {item}
          </span>
          {index < items.length - 1 ? (
            <CircleDot className="h-3 w-3 text-[var(--mute)]" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
