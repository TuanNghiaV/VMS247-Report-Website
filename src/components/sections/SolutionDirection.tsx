import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { CheckCircle2 } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const SolutionDirection: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const solutions = [
    {
      title: "01. Xử Lý Tại Chỗ (On-premise)",
      desc: "Toàn bộ luồng video, suy luận AI (inference), ghi sự kiện và lưu trữ bằng chứng được thực hiện hoàn toàn tại nhà máy.",
      benefits: [
        "Giảm phụ thuộc vào kết nối cloud bên ngoài.",
        "Dữ liệu nhạy cảm hoàn toàn không rời khỏi hạ tầng nội bộ.",
        "Phù hợp tối đa với các quy định bảo mật công nghiệp của nhà máy."
      ]
    },
    {
      title: "02. Tận Dụng Camera Hiện Hữu",
      desc: "Tận dụng hệ thống camera IP hiện hữu sẵn có nếu hỗ trợ giao thức RTSP/ONVIF Profile S và đáp ứng tối thiểu yêu cầu chất lượng ảnh.",
      benefits: [
        "Không cần đầu tư thay thế hàng loạt camera mới.",
        "Giảm tối đa chi phí đầu tư ban đầu (CAPEX).",
        "Hạn chế rủi ro gián đoạn hoạt động sản xuất khi thi công lắp ráp."
      ]
    },
    {
      title: "03. Mô Hình AI Tùy Biến",
      desc: "Mô hình AI học sâu được tinh chỉnh (fine-tune) bằng chính hình ảnh thực tế thu được tại xưởng sản xuất Hợp Lực.",
      benefits: [
        "Giảm thiểu tối đa tỷ lệ cảnh báo sai (false alarm).",
        "Tăng độ chính xác trong môi trường thực tế bụi bặm, ánh sáng phức tạp.",
        "Chủ động cập nhật mô hình khi bổ sung quy tắc an toàn hoặc khu vực mới."
      ]
    }
  ];

  return (
    <SectionShell id="solution-direction" isActive={isActive}>
      <div className="mb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Định Hướng Giải Pháp VMS247
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          VMS247 được định hướng là nền tảng AI Camera on-premise, tận dụng camera hiện hữu qua RTSP/ONVIF, xử lý AI tại server nội bộ, lưu bằng chứng trên NAS và gửi cảnh báo thời gian thực qua dashboard/Zalo/SMS/Email.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {solutions.map((sol, idx) => (
          <GlassCard
            key={idx}
            className="p-5 border border-[var(--hairline-strong)] flex flex-col justify-between"
            hoverGlow={false}
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                <h3 className="text-sm font-bold text-[var(--ink)] font-mono">
                  {sol.title}
                </h3>
              </div>
              <p className="text-xs text-[var(--body)] leading-relaxed mb-4">
                {sol.desc}
              </p>
            </div>

            <div className="border-t border-[var(--hairline)] pt-3.5 mt-auto">
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider block mb-2">Lợi ích cốt lõi:</span>
              <ul className="space-y-1.5">
                {sol.benefits.map((b, bIdx) => (
                  <li key={bIdx} className="text-[11px] text-[var(--body)] flex items-start gap-1">
                    <span className="text-green-500 font-mono mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionShell>
  );
};
