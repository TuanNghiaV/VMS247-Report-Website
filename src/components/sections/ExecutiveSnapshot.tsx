import React from "react";
import { Camera, Cpu, Database, Gauge } from "lucide-react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";

interface SectionProps {
  isActive?: boolean;
  onNavigate?: (index: number) => void;
}

export const ExecutiveSnapshot: React.FC<SectionProps> = ({
  isActive = false,
  onNavigate,
}) => {
  const chips = [
    "On-premise AI",
    "Tận dụng camera RTSP/ONVIF",
    "Evidence-first",
    "Pilot 18 camera",
  ];

  const metrics = [
    {
      title: "18 camera",
      label: "Phạm vi pilot tại Gia Lâm",
      description: "Đánh giá trên hệ thống camera hiện hữu trước khi mở rộng.",
      icon: Camera,
    },
    {
      title: "4 nghiệp vụ AI",
      label: "Xâm nhập, cháy/khói, PPE, chấm công",
      description: "Tập trung vào các bài toán quan sát có giá trị vận hành rõ.",
      icon: Cpu,
    },
    {
      title: "On-premise",
      label: "Xử lý & lưu bằng chứng trong nhà máy",
      description: "Luồng video, sự kiện và bằng chứng được giữ trong hạ tầng nội bộ.",
      icon: Database,
    },
    {
      title: "Benchmark thực tế",
      label: "Chốt model và KPI bằng dữ liệu thật",
      description: "KPI là mục tiêu kiểm chứng sau thử nghiệm, không phải cam kết tuyệt đối.",
      icon: Gauge,
    },
  ];

  return (
    <SectionShell id="executive-snapshot" isActive={isActive}>
      <div className="mb-6 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--ink)] tracking-tight">
          Nền tảng VMS247 AI Camera
        </h1>
        <p className="text-[var(--body)] text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
          Nền tảng AI camera on-premise cho nhà máy, tận dụng camera IP hiện có,
          lưu bằng chứng tại chỗ và hỗ trợ vận hành theo thời gian thực.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6" data-section-nav-ignore="true">
        {chips.map((chip) => (
          <span
            key={chip}
            className="text-[10px] md:text-xs font-bold font-mono tracking-wide text-[var(--ink)] border border-[var(--hairline-strong)] px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--surface-soft)]"
          >
            {chip}
          </span>
        ))}
      </div>

      <GlassCard
        className="p-5 md:p-6 mb-5 border border-[var(--hairline-strong)]"
        hoverGlow={false}
        data-section-nav-ignore="true"
      >
        <span className="text-[10px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-3 font-mono">
          Executive snapshot
        </span>
        <p className="text-[var(--body)] text-sm md:text-base leading-relaxed max-w-4xl">
          VMS247 AI Camera là nền tảng pilot cho nhà máy Gia Lâm: tái sử dụng
          camera IP sẵn có, đưa luồng video về AI Server nội bộ để suy luận,
          tạo sự kiện, lưu ảnh/clip bằng chứng và hỗ trợ đội vận hành phản ứng
          nhanh hơn. Mục tiêu pilot là kiểm chứng tính khả thi kỹ thuật,
          benchmark model bằng dữ liệu thật và xác nhận cấu hình chi phí phù hợp.
        </p>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(2)}
            className="px-5 py-2 text-xs font-bold font-mono rounded-[var(--radius-pill)] bg-[var(--ink)] text-[var(--canvas)] hover:opacity-90 cursor-pointer transition-all border border-[var(--ink)]"
          >
            Xem kiến trúc
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(10)}
            className="px-5 py-2 text-xs font-bold font-mono rounded-[var(--radius-pill)] bg-[var(--canvas)] text-[var(--ink)] border border-[var(--hairline-strong)] hover:bg-[var(--surface-soft)] cursor-pointer transition-all"
          >
            Xem phần cứng
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(11)}
            className="px-5 py-2 text-xs font-bold font-mono rounded-[var(--radius-pill)] bg-[var(--canvas)] text-[var(--ink)] border border-[var(--hairline-strong)] hover:bg-[var(--surface-soft)] cursor-pointer transition-all"
          >
            Xem khuyến nghị triển khai
          </button>
        </div>
      </GlassCard>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-section-nav-ignore="true"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="p-4 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] hover:border-[var(--hairline-strong)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold text-[var(--mute)] uppercase tracking-wider font-mono leading-snug">
                  {metric.label}
                </span>
                <Icon className="w-4 h-4 text-[var(--mute)] flex-shrink-0" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-[var(--ink)] tracking-tight">
                {metric.title}
              </h3>
              <p className="text-[var(--body)] text-[11px] md:text-xs leading-relaxed mt-2">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
};
