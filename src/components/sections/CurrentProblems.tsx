import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { AlertCircle } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const CurrentProblems: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const problems = [
    {
      tag: "BẢO MẬT",
      title: "Phụ thuộc cloud / bên thứ ba",
      desc: "Dữ liệu hình ảnh nhà xưởng, bố trí sản xuất và hoạt động nội bộ có thể phải truyền qua hệ thống cloud hoặc nhà cung cấp bên ngoài.",
      impact: "Tăng rủi ro lộ dữ liệu nội bộ, khó kiểm soát quyền truy cập và khó đảm bảo chủ quyền dữ liệu."
    },
    {
      tag: "VẬN HÀNH",
      title: "Camera chủ yếu ghi hình thụ động",
      desc: "Camera hiện tại chủ yếu phục vụ xem trực tiếp hoặc xem lại sau sự cố.",
      impact: "Khi có vi phạm an toàn, cháy/khói hoặc xâm nhập vùng cấm, hệ thống không chủ động cảnh báo ngay lập tức."
    },
    {
      tag: "TÙY BIẾN",
      title: "AI có sẵn khó tùy biến",
      desc: "Các tính năng AI tích hợp sẵn trong camera thường rập khuôn, khó tinh chỉnh theo góc quay, ánh sáng, quy định an toàn và điều kiện thực tế của Hợp Lực.",
      impact: "Dễ phát sinh cảnh báo sai hoặc bỏ sót tình huống quan trọng."
    },
    {
      tag: "CHI PHÍ",
      title: "Nâng cấp bằng cách thay camera gây tốn kém",
      desc: "Nếu muốn có AI tốt hơn, nhiều giải pháp yêu cầu thay mới camera hoặc mua license riêng từ hãng.",
      impact: "Tăng CAPEX, gây gián đoạn vận hành và không tận dụng được hạ tầng hiện hữu."
    }
  ];

  return (
    <SectionShell id="current-problems" isActive={isActive}>
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Thực Trạng Hệ Thống Giám Sát Hiện Tại
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Hệ thống camera hiện tại của Hợp Lực chủ yếu đóng vai trò ghi hình và giám sát thụ động. Việc vận hành còn phụ thuộc nhiều vào con người hoặc dịch vụ cloud của bên thứ ba. Điều này tạo ra rủi ro về bảo mật dữ liệu, hạn chế khả năng cảnh báo tức thời và làm tăng chi phí khi muốn nâng cấp hệ thống.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {problems.map((prob, idx) => (
          <GlassCard
            key={idx}
            className="p-5 border border-[var(--hairline-strong)] flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200"
            hoverGlow={false}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500" />
                  <h3 className="text-sm font-bold text-[var(--ink)] font-mono">
                    {prob.title}
                  </h3>
                </div>
                <span className="text-[9px] font-bold font-mono tracking-wider text-[var(--mute)] border border-[var(--hairline)] px-2 py-0.5 rounded-[var(--radius-pill)] bg-[var(--surface-soft)] whitespace-nowrap">
                  {prob.tag}
                </span>
              </div>
              <p className="text-xs text-[var(--body)] leading-relaxed mb-4">
                {prob.desc}
              </p>
            </div>
            <div className="border-t border-[var(--hairline)] pt-3">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-1">Ảnh hưởng:</span>
              <p className="text-[11px] text-[var(--body)] leading-normal italic">
                {prob.impact}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-[var(--radius-card)] text-center text-xs font-bold text-[var(--ink)]">
        🚨 Kết luận: Hệ thống cần chuyển đổi từ camera ghi hình thụ động sang trợ lý AI giám sát chủ động 24/7.
      </div>
    </SectionShell>
  );
};
