import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const CurrentProblemsSolution: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const problems = [
    {
      title: "Phụ thuộc cloud bên thứ ba",
      desc: "Nguy cơ rò rỉ dữ liệu vận hành nội bộ, hình ảnh sản xuất và sơ đồ mặt bằng nhà máy ra Internet.",
    },
    {
      title: "Camera chủ yếu ghi hình thụ động",
      desc: "Hệ thống ghi nhận sự kiện nhưng vẫn cần con người trực tiếp giám sát hoặc chỉ dùng để tra cứu lại sau khi sự cố đã xảy ra.",
    },
    {
      title: "AI có sẵn còn rập khuôn",
      desc: "Các giải pháp đóng gói sẵn khó tương thích hoặc hoạt động kém hiệu quả dưới điều kiện ánh sáng, góc camera đặc thù tại nhà máy.",
    },
    {
      title: "Nâng cấp đòi hỏi thay mới thiết bị",
      desc: "Nhiều giải pháp yêu cầu thay mới toàn bộ camera thông minh, làm tăng đáng kể chi phí đầu tư (CAPEX) và gây gián đoạn vận hành.",
    },
  ];

  const solutions = [
    {
      title: "Xử lý On-premise tại nhà máy",
      desc: "Toàn bộ luồng dữ liệu video, suy luận AI và lưu trữ bằng chứng được thực hiện hoàn toàn nội bộ trong hạ tầng mạng của Hợp Lực.",
    },
    {
      title: "Tận dụng tối đa camera hiện hữu",
      desc: "Kết nối trực tiếp luồng stream RTSP/ONVIF từ các camera IP sẵn có mà không bắt buộc phải đầu tư thay thế hàng loạt.",
    },
    {
      title: "Mô hình AI huấn luyện thực tế",
      desc: "Khả năng tinh chỉnh và tối ưu hóa mô hình AI theo đúng góc quay, điều kiện ánh sáng và hành lang an toàn của từng nhà máy.",
    },
  ];

  return (
    <SectionShell id="problems-solution" isActive={isActive}>
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Vấn Đề Hiện Tại & Hướng Giải Quyết
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Nhận diện những hạn chế của hệ thống giám sát truyền thống và định hình kiến trúc giải pháp VMS247.
        </p>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {/* Left column: Problems */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4.5 w-4.5 text-red-500" />
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
              Hạn chế của hệ thống cũ
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {problems.map((prob, idx) => (
              <GlassCard
                key={idx}
                className="p-4 border border-[var(--hairline)]"
                hoverGlow={false}
              >
                <h4 className="text-xs font-bold text-[var(--ink)] mb-1 flex items-start gap-1.5">
                  <span className="text-red-500 font-mono text-[10px] bg-red-500/10 px-1 py-0.5 rounded">
                    0{idx + 1}
                  </span>
                  {prob.title}
                </h4>
                <p className="text-[11px] text-[var(--body)] leading-relaxed">
                  {prob.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right column: Solutions & Pipeline */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                Định hướng giải pháp VMS247
              </h3>
            </div>
            <div className="space-y-2.5">
              {solutions.map((sol, idx) => (
                <GlassCard
                  key={idx}
                  className="p-3 border border-[var(--hairline-strong)]"
                  hoverGlow={false}
                >
                  <h4 className="text-xs font-bold text-[var(--ink)] mb-0.5">
                    {sol.title}
                  </h4>
                  <p className="text-[11px] text-[var(--body)] leading-relaxed">
                    {sol.desc}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Simple flow */}
          <div className="p-3 bg-[var(--surface-soft)] border border-[var(--hairline)] rounded-[var(--radius-card)]">
            <span className="text-[10px] uppercase font-bold text-[var(--mute)] tracking-wider block mb-2 font-mono">
              Luồng xử lý tối giản (On-premise Flow)
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[var(--ink)]">
              <span className="px-2 py-1 bg-[var(--canvas)] border border-[var(--hairline)] rounded">Camera Hiện Hữu</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--mute)]" />
              <span className="px-2 py-1 bg-[var(--canvas)] border border-[var(--hairline)] rounded">RTSP/ONVIF Ingest</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--mute)]" />
              <span className="px-2 py-1 bg-[var(--canvas)] border border-[var(--hairline)] rounded">AI Server (Local)</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--mute)]" />
              <span className="px-2 py-1 bg-[var(--canvas)] border border-[var(--hairline)] rounded">Zalo/Email Alert & Web PWA</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--mute)]" />
              <span className="px-2 py-1 bg-[var(--canvas)] border border-[var(--hairline)] rounded">NAS Storage</span>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};
