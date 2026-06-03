import React from "react";
import { Cpu, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "../../utils/cn";

export const GpuComparisonForm: React.FC = () => {
  const gpus = [
    {
      name: "NVIDIA L4 24GB",
      vram: "24GB GDDR6",
      nvdec: "4 NVDEC (hỗ trợ AV1, H.265)",
      tdp: "72W (Không nguồn phụ)",
      formFactor: "Single-slot, Low-profile",
      target: "Inference & Decode camera mật độ cao",
      verdict: "Khuyến nghị chính",
      recommended: true,
      desc: "Lựa chọn tối ưu nhất cho pilot 18 camera. TDP cực thấp, kích thước nhỏ gọn dễ lắp rack 2U, hiệu năng decode/inference DeepStream xuất sắc.",
    },
    {
      name: "NVIDIA A2 16GB",
      vram: "16GB GDDR6",
      nvdec: "2 NVDEC (hỗ trợ H.265)",
      tdp: "40W - 60W",
      formFactor: "Single-slot, Low-profile",
      target: "Edge node nhỏ / Tiết kiệm chi phí",
      verdict: "Phù hợp edge nhỏ",
      recommended: false,
      desc: "Phù hợp cho các cụm xử lý nhỏ ở rìa (edge) có số lượng camera ít (< 10 cam). Headroom thấp, khó mở rộng lên 18+ camera chạy đa mô hình.",
    },
    {
      name: "NVIDIA A10 24GB",
      vram: "24GB GDDR6",
      nvdec: "1 NVDEC + 1 NVENC",
      tdp: "150W",
      formFactor: "Single-slot, Full-height",
      target: "Workload hỗn hợp AI & Graphics/vGPU",
      verdict: "Workload hỗn hợp",
      recommended: false,
      desc: "Phù hợp cho các máy chủ cần kết hợp ảo hóa workstation (vGPU) hoặc đồ họa 3D cùng AI. Tiêu thụ điện và tỏa nhiệt cao hơn L4.",
    },
    {
      name: "NVIDIA L40S 48GB",
      vram: "48GB GDDR6",
      nvdec: "3 NVDEC + 3 NVENC",
      tdp: "350W",
      formFactor: "Dual-slot, Full-height",
      target: "Inference LLM / Generative AI / Training",
      verdict: "Overkill cho pilot",
      recommended: false,
      desc: "GPU hiệu năng cực kỳ mạnh mẽ cho Generative AI và Training. Quá dư thừa (overkill) và tốn điện cho bài toán video analytics 18 camera của pilot.",
    },
  ];

  return (
    <div className="space-y-5 text-xs text-[var(--body)]" data-section-nav-ignore="true">
      {/* Intro info */}
      <div className="p-3 bg-[var(--canvas-soft)] border border-[var(--hairline)] rounded-lg flex items-start gap-2">
        <Cpu className="h-4.5 w-4.5 text-[var(--primary)] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Hệ thống <strong>VMS247 AI Camera</strong> on-premise yêu cầu GPU chuyên dụng dành cho máy chủ (Server-grade / Data-center GPU) nhằm đảm bảo tính ổn định vận hành 24/7/365, hỗ trợ đầy đủ driver ảo hóa vGPU và tối ưu hóa điện năng tiêu thụ trong tủ rack.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {gpus.map((gpu) => (
          <div
            key={gpu.name}
            className={cn(
              "p-3.5 rounded-[var(--radius-card)] border flex flex-col justify-between gap-2.5 transition-all",
              gpu.recommended
                ? "border-[var(--success)] bg-[var(--success)]/5 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                : "border-[var(--hairline)] bg-[var(--surface)]"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-[var(--ink)] font-mono">{gpu.name}</h4>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-[var(--radius-pill)] text-[9px] font-bold border font-mono",
                    gpu.recommended
                      ? "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]"
                      : "border-[var(--hairline-strong)] bg-[var(--canvas-soft)] text-[var(--mute)]"
                  )}
                >
                  {gpu.verdict}
                </span>
              </div>
              <p className="text-[11px] text-[var(--body)] leading-relaxed mb-3">{gpu.desc}</p>
              
              <div className="space-y-1.5 font-mono text-[10px] border-t border-[var(--hairline)] pt-2.5">
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Dung lượng VRAM:</span>
                  <span className="font-semibold text-[var(--ink)]">{gpu.vram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Bộ giải mã video:</span>
                  <span className="font-semibold text-[var(--ink)] text-right">{gpu.nvdec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Điện năng (TDP):</span>
                  <span className="font-semibold text-[var(--ink)]">{gpu.tdp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--mute)]">Kích thước (Form factor):</span>
                  <span className="font-semibold text-[var(--ink)] text-right">{gpu.formFactor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note about high-end training cards */}
      <div className="p-3 border border-[var(--hairline)] bg-[var(--canvas-soft)] rounded-lg flex items-start gap-2">
        <ShieldCheck className="h-4.5 w-4.5 text-[var(--mute)] shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-[var(--mute)]">
          * Lưu ý: Các dòng card máy chủ hiệu năng cực cao như <strong>A100 / H100 / H200</strong> được chủ động loại khỏi danh sách so sánh rút gọn (shortlist) vì chi phí đầu tư quá lớn, thường dùng cho mục đích huấn luyện (training) mô hình ngôn ngữ lớn hoặc HPC, hoàn toàn không tối ưu chi phí cho bài toán suy luận (inference) phân tích video camera đầu cuối.
        </p>
      </div>

      {/* General Conclusion */}
      <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg flex items-start gap-2">
        <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-amber-600 font-medium">
          <strong>Kết luận:</strong> Đối với pilot 18 camera VMS247, <strong>NVIDIA L4 24GB</strong> là lựa chọn cân bằng nhất giữa khả năng xử lý video nhiều luồng, điện năng, form factor server và dư địa mở rộng. A2 phù hợp edge nhỏ hơn, A10 phù hợp workload hỗn hợp graphics/vGPU, còn L40S mạnh nhưng thường quá dư và tốn điện cho pilot này.
        </p>
      </div>
    </div>
  );
};
