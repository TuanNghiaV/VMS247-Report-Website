import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { Cpu } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const GpuRecommendation: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const gpus = [
    {
      name: "NVIDIA L4 24GB",
      vram: "24GB GDDR6",
      nvdec: "4 NVDEC (AV1/H.265)",
      tdp: "72W",
      fit: "Single-slot, Low-profile",
      target: "Inference & Decode mật độ cao",
      verdict: "Khuyến nghị chính",
      recommended: true,
      desc: "Tối ưu nhất cho pilot 18 camera: TDP thấp, giải mã luồng mạnh, lắp vừa khay máy chủ 2U chuẩn.",
    },
    {
      name: "NVIDIA A2 16GB",
      vram: "16GB GDDR6",
      nvdec: "2 NVDEC (H.265)",
      tdp: "40W - 60W",
      fit: "Single-slot, Low-profile",
      target: "Edge node quy mô nhỏ",
      verdict: "Phù hợp edge nhỏ",
      recommended: false,
      desc: "Phù hợp cho edge server có số lượng camera ít (< 10 cam). Sẽ bị thiếu hụt tài nguyên khi nâng cấp.",
    },
    {
      name: "NVIDIA A10 24GB",
      vram: "24GB GDDR6",
      nvdec: "1 NVDEC + 1 NVENC",
      tdp: "150W",
      fit: "Single-slot, Full-height",
      target: "Workload hỗn hợp AI + Graphics",
      verdict: "Tải hỗn hợp",
      recommended: false,
      desc: "Dùng cho máy chủ chạy kết hợp đồ họa vGPU ảo hóa và AI. Tiêu hao điện năng và sinh nhiệt lớn hơn L4.",
    },
    {
      name: "NVIDIA L40S 48GB",
      vram: "48GB GDDR6",
      nvdec: "3 NVDEC + 3 NVENC",
      tdp: "350W",
      fit: "Dual-slot, Full-height",
      target: "Training / Generative AI",
      verdict: "Quá dư cho pilot",
      recommended: false,
      desc: "GPU hiệu năng cao dành cho Training và Generative AI. Không tối ưu chi phí cho nhu cầu video analytics pilot.",
    },
  ];

  return (
    <SectionShell id="gpu-recommendation" isActive={isActive}>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Lựa Chọn & Đề Xuất GPU Chuyên Dụng
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          So sánh kỹ thuật giữa các dòng GPU máy chủ (Server-grade) để tìm giải pháp tối ưu cho VMS247.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden" data-section-nav-ignore="true">
        {/* Left Column: Verdict */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]">
          <GlassCard className="p-5 border border-[var(--hairline-strong)]" hoverGlow={false}>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">
                Đề Xuất Lựa Chọn Lõi
              </h3>
            </div>
            <p className="text-[var(--body)] text-xs leading-relaxed mb-3">
              Hệ thống VMS247 on-premise tại nhà máy Gia Lâm yêu cầu GPU chuyên dụng dành cho máy chủ (Server-grade / Data-center) để đảm bảo độ bền bỉ khi chạy liên tục 24/7/365 và tương thích driver vGPU doanh nghiệp.
            </p>
            <p className="text-[var(--body)] text-xs leading-relaxed mb-4">
              <strong>NVIDIA L4 24GB</strong> là sự lựa chọn tối ưu nhất cho pilot 18 camera, cân bằng hoàn hảo giữa mật độ giải mã video, điện năng tiêu thụ thấp (72W) và form factor nhỏ gọn.
            </p>

            <div className="p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-lg text-[10px] space-y-1">
              <span className="font-bold text-[var(--ink)] block">R&D Note:</span>
              <p className="text-[var(--text-soft)] leading-normal">
                Các dòng card máy chủ công suất cực lớn như A100/H100 được loại khỏi danh sách vì chi phí quá cao, phục vụ chính cho huấn luyện (training) LLM chứ không tối ưu cho suy luận (inference) video đầu cuối.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Comparison Cards */}
        <div className="lg:col-span-2 flex flex-col gap-3 overflow-y-auto pr-2 max-h-[calc(100svh-280px)]">
          <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider mb-1 font-mono">
            Bảng thông số các GPU Server ứng viên
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gpus.map((gpu) => (
              <div
                key={gpu.name}
                className={`p-3.5 rounded-[var(--radius-card)] border flex flex-col justify-between gap-2.5 transition-all ${
                  gpu.recommended
                    ? "border-[var(--success)] bg-[var(--success)]/5 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                    : "border-[var(--hairline)] bg-[var(--surface)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-[var(--ink)] font-mono">{gpu.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-[var(--radius-pill)] text-[9px] font-bold border font-mono ${
                        gpu.recommended
                          ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                          : "border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--mute)]"
                      }`}
                    >
                      {gpu.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--body)] leading-relaxed mb-3">{gpu.desc}</p>
                  
                  <div className="space-y-1.5 font-mono text-[10px] border-t border-[var(--hairline)] pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">VRAM:</span>
                      <span className="font-semibold text-[var(--ink)]">{gpu.vram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">NVDEC (Decode):</span>
                      <span className="font-semibold text-[var(--ink)] text-right">{gpu.nvdec}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">TDP (Công suất):</span>
                      <span className="font-semibold text-[var(--ink)]">{gpu.tdp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--mute)]">Form Factor:</span>
                      <span className="font-semibold text-[var(--ink)] text-right">{gpu.fit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};
