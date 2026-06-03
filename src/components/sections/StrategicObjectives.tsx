import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { ShieldAlert, PiggyBank, BarChart3 } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const StrategicObjectives: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const objectives = [
    {
      title: "Bảo mật dữ liệu tuyệt đối",
      desc: "Loại bỏ hoàn toàn sự phụ thuộc vào cloud của bên thứ ba. Dữ liệu hình ảnh sản xuất, sơ đồ bố trí nhà máy và nhật ký vi phạm được lưu trữ và xử lý độc lập bên trong mạng nội bộ của nhà máy.",
      icon: ShieldAlert,
      tag: "BẢO MẬT",
    },
    {
      title: "Tối ưu hóa chi phí đầu tư",
      desc: "Tận dụng lại tối đa hệ thống camera IP sẵn có thông qua luồng RTSP/ONVIF Profile S tiêu chuẩn. Giảm thiểu chi phí mua mới thiết bị đầu cuối và đẩy nhanh tiến độ triển khai thử nghiệm.",
      icon: PiggyBank,
      tag: "TỐI ƯU HÓA",
    },
    {
      title: "Nâng tầm năng lực quản lý",
      desc: "Chuyển đổi từ mô hình giám sát thụ động (chỉ ghi hình và xem lại) sang trợ lý giám sát thông minh hoạt động 24/7. Cảnh báo lỗi an toàn HSE, xâm nhập vùng cấm ngay lập tức để xử lý kịp thời.",
      icon: BarChart3,
      tag: "HIỆU QUẢ",
    },
  ];

  return (
    <SectionShell id="strategic-objectives" isActive={isActive}>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Mục Tiêu Chiến Lược
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Định vị giá trị cốt lõi của VMS247 nhằm giải quyết bài toán an ninh, an toàn lao động và tối ưu hóa tài sản doanh nghiệp.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {objectives.map((obj, idx) => {
          const Icon = obj.icon;
          return (
            <GlassCard
              key={idx}
              className="p-6 border border-[var(--hairline-strong)] flex flex-col justify-between"
              hoverGlow={false}
            >
              <div>
                <span className="text-[9px] font-bold font-mono tracking-wider text-[var(--mute)] border border-[var(--hairline)] px-2 py-0.5 rounded-[var(--radius-pill)] uppercase bg-[var(--surface-soft)]">
                  {obj.tag}
                </span>
                <div className="p-3 w-fit rounded-[var(--radius-card)] border border-[var(--hairline)] text-[var(--ink)] bg-[var(--canvas-soft)] mt-4 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-[var(--ink)] tracking-tight mb-2">
                  {obj.title}
                </h3>
                <p className="text-xs text-[var(--body)] leading-relaxed">
                  {obj.desc}
                </p>
              </div>

              <div className="text-[10px] font-mono text-[var(--mute)] mt-6 pt-3 border-t border-[var(--hairline)]">
                Mục tiêu thử nghiệm Pilot Gia Lâm
              </div>
            </GlassCard>
          );
        })}
      </div>
    </SectionShell>
  );
};
