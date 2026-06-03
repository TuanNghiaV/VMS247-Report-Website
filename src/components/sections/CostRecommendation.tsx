import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  ListChecks,
} from "lucide-react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { TechChapterLabel } from "../ui/TechChapter";

interface SectionProps {
  isActive?: boolean;
  onNavigate?: (index: number) => void;
}

const decisionGroups = [
  {
    title: "Kiến trúc chốt cho pilot",
    items: [
      "On-premise AI Server tại nhà máy",
      "Tận dụng camera RTSP/ONVIF sẵn có",
      "Pipeline chính: DeepStream / TensorRT",
      "Rule Engine + Evidence-first storage",
      "Dashboard + Notification + Audit",
    ],
  },
  {
    title: "Hạ tầng chốt sơ bộ",
    items: [
      "GPU class NVIDIA L4",
      "NAS RAID 6 cho video retention",
      "MinIO cho snapshot / clip bằng chứng",
      "PostgreSQL cho metadata / audit",
      "Docker Compose đủ cho pilot",
    ],
  },
  {
    title: "Điều kiện trước khi triển khai",
    items: [
      "Benchmark bằng dữ liệu thật tại xưởng",
      "Kiểm tra góc quay / ánh sáng / bitrate camera",
      "Chốt phạm vi 4 nghiệp vụ AI",
      "Xác định retention / backup / phân quyền",
      "Lấy báo giá từ 2-3 nhà cung cấp",
    ],
  },
];

const nextSteps = [
  "Khảo sát camera & mạng hiện trạng",
  "Chạy benchmark thực tế",
  "Chốt BOM phần cứng & lưu trữ",
  "Triển khai pilot + nghiệm thu KPI",
];

export const CostRecommendation: React.FC<SectionProps> = ({
  isActive = false,
  onNavigate,
}) => {
  return (
    <SectionShell
      id="final-recommendation"
      isActive={isActive}
      contentClassName="max-w-6xl"
    >
      <div className="mb-5">
        <TechChapterLabel label="KẾT LUẬN TRIỂN KHAI" />
        <h2 className="text-2xl md:text-4xl font-bold text-[var(--ink)] tracking-tight">
          Kết luận & Khuyến nghị triển khai pilot
        </h2>
        <p className="text-[var(--body)] text-sm md:text-base mt-2 max-w-4xl leading-relaxed">
          Tóm tắt quyết định kiến trúc, phạm vi triển khai và các bước tiếp
          theo cho pilot 18 camera tại nhà máy Gia Lâm.
        </p>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 lg:overflow-hidden overflow-visible"
        data-section-nav-ignore="true"
      >
        <div className="lg:col-span-2 flex flex-col gap-4 lg:overflow-y-auto overflow-visible pr-1 lg:max-h-[calc(100svh-210px)] max-h-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decisionGroups.map((group) => (
              <GlassCard
                key={group.title}
                className="p-4 border border-[var(--hairline-strong)]"
                hoverGlow={false}
              >
                <h3 className="text-sm font-extrabold text-[var(--ink)] tracking-tight mb-3">
                  {group.title}
                </h3>
                <ul className="space-y-2.5 text-xs text-[var(--body)] leading-relaxed">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--success)] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          <GlassCard
            className="p-5 border border-[var(--hairline-strong)]"
            hoverGlow={false}
          >
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="h-4 w-4 text-[var(--ink)]" />
              <h3 className="text-sm font-extrabold text-[var(--ink)] tracking-tight">
                Bước tiếp theo
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {nextSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--canvas-soft)] p-3 min-h-0 md:min-h-[104px]"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--ink)] text-[var(--canvas)] text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <p className="text-xs text-[var(--body)] leading-relaxed mt-3">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-4 lg:overflow-y-auto overflow-visible lg:max-h-[calc(100svh-210px)] max-h-none pr-1">
          <GlassCard
            className="p-5 border border-[var(--hairline-strong)]"
            hoverGlow={false}
          >
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="h-4 w-4 text-[var(--ink)]" />
              <h3 className="text-sm font-extrabold text-[var(--ink)] tracking-tight">
                Quyết định chính
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[var(--body)] leading-relaxed">
              {[
                "Pilot 18 camera",
                "4 module AI ưu tiên",
                "On-premise trước, scale sau",
                "Không over-engineer giai đoạn pilot",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-[var(--mute)] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard
            className="p-5 border border-[var(--hairline-strong)]"
            hoverGlow={false}
          >
            <div className="flex items-center gap-2 mb-3">
              <Coins className="h-4 w-4 text-[var(--ink)]" />
              <h3 className="text-sm font-extrabold text-[var(--ink)] tracking-tight">
                Dự toán tham khảo
              </h3>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              540 triệu - 1.15 tỷ VND
            </p>
            <p className="text-xs text-[var(--mute)] leading-relaxed mt-3">
              Con số chỉ dùng để lập ngân sách tham khảo. Cần lấy báo giá chính
              thức từ 2-3 nhà cung cấp trước khi phê duyệt triển khai.
            </p>
          </GlassCard>

          <GlassCard
            className="p-5 border border-[var(--hairline)]"
            hoverGlow={false}
          >
            <span className="text-[10px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-3 font-mono">
              Điều hướng nhanh
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(3)}
                className="px-3 py-2 text-[10px] font-bold font-mono rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer text-center"
              >
                Xem ngăn xếp công nghệ
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(10)}
                className="px-3 py-2 text-[10px] font-bold font-mono rounded-[var(--radius-pill)] border border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--ink)] hover:bg-[var(--surface-soft)] cursor-pointer text-center"
              >
                Xem cấu hình phần cứng
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
};
