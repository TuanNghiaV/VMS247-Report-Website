import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { ClassificationStrip, TechChapterLabel } from "../ui/TechChapter";
import { CheckCircle2, Network, ShieldCheck } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

const classification = [
  {
    title: "Core Pilot",
    status: "core" as const,
    items: ["RTSP", "ONVIF Profile S", "Camera VLAN", "Managed PoE Switch 24-port", "10GbE", "Local NTP"],
  },
  {
    title: "Optional",
    status: "optional" as const,
    items: ["ONVIF Profile M", "Tự động theo dõi trạng thái camera"],
  },
  {
    title: "Future/R&D",
    status: "future" as const,
    items: ["MQTT/Sparkplug", "OPC UA nếu tích hợp hệ thống nhà máy ở giai đoạn sau"],
  },
];

const auditItems = [
  "Kiểm tra URL RTSP",
  "Hỗ trợ ONVIF Profile S",
  "Codec H.264/H.265",
  "Tối thiểu 1080p",
  "Duy trì 10-15 FPS ổn định cho AI",
  "Độ ổn định bitrate",
  "Góc nhìn rõ người / PPE / ROI",
  "WDR/IR cho môi trường thiếu sáng",
  "Góc lắp không quá cao hoặc quá xa",
  "Không bị mờ, mốc hoặc vật cản che khuất",
  "Độ ổn định PoE",
  "Độ trễ mạng / jitter",
  "Đồng bộ timestamp bằng NTP nội bộ",
];

const topology = ["Camera VLAN", "Managed PoE Switch", "Core / Uplink 10GbE", "AI Server / NAS"];

export const CameraNetworkStack: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  return (
    <SectionShell id="camera-network-stack" isActive={isActive}>
      <div className="mb-3">
        <TechChapterLabel index={2} />
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
          Hạ tầng Camera & Mạng nội bộ
        </h2>
        <p className="mt-1 max-w-4xl text-sm leading-relaxed text-[var(--body)]">
          Khảo sát khả năng tận dụng camera hiện hữu và thiết kế mạng camera VLAN an toàn, ổn định.
        </p>
      </div>

      <ClassificationStrip groups={classification} className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3" />

      <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-2" data-section-nav-ignore="true">
        <div className="max-h-[calc(100svh-330px)] overflow-y-auto pr-1">
          <GlassCard className="border border-[var(--hairline-strong)] p-5" hoverGlow={false}>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
                Checklist kiểm tra camera
              </h3>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-[var(--body)]">
              Không cần thay toàn bộ camera ngay. Cần kiểm tra từng camera trước, sau đó phân loại thành: dùng được ngay, cần chỉnh góc/cấu hình, hoặc cần thay thế.
            </p>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {auditItems.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] px-3 py-2 text-xs text-[var(--body)]"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--body)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="max-h-[calc(100svh-330px)] overflow-y-auto pr-1">
          <GlassCard className="border border-[var(--hairline-strong)] p-5" hoverGlow={false}>
            <div className="mb-3 flex items-center gap-2">
              <Network className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink)]">
                Sơ đồ kết nối đề xuất cho pilot 18 camera
              </h3>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-2">
              {topology.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--surface-soft)] text-[11px] font-semibold text-[var(--body)]">
                    {index + 1}
                  </div>
                  <div className="flex-1 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--ink)]">
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[var(--body)]">
              <p>
                Camera chỉ nên gửi RTSP/ONVIF trong mạng nội bộ. AI Server nhận luồng, xử lý GPU và ghi bằng chứng về NAS qua đường 10GbE.
              </p>
              <p>
                NTP nội bộ là bắt buộc để mốc thời gian trên video, sự kiện và snapshot không lệch nhau khi truy xuất bằng chứng.
              </p>
              <p className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--surface-soft)] p-3">
                Khuyến nghị Gia Lâm: bắt đầu với Camera VLAN, managed PoE switch 24-port, uplink 10GbE tới AI Server/NAS và checklist kiểm tra camera trước khi quyết định thay thế.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
};
