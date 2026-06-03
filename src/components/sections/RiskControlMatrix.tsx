import React from "react";
import { SectionShell } from "../layout/SectionShell";
import { GlassCard } from "../ui/GlassCard";
import { AlertTriangle, CheckSquare } from "lucide-react";

interface SectionProps {
  isActive?: boolean;
}

export const RiskControlMatrix: React.FC<SectionProps> = ({
  isActive = false,
}) => {
  const risks = [
    {
      title: "Camera hiện hữu không đủ rõ",
      impact: "Cao",
      why: "AI khó nhận diện chính xác PPE, người, hoặc khuôn mặt nếu camera quá xa, góc quay quá cao hoặc thiếu sáng.",
      control: "Tiến hành khảo sát (audit) từng camera hiện hữu. Đo đạc độ phân giải, kiểm tra góc nhìn và đo cường độ ánh sáng thực tế. Chỉ thay thế các mắt camera ở vị trí trọng yếu không đạt yêu cầu tối thiểu."
    },
    {
      title: "Ánh sáng thay đổi theo ca làm việc",
      impact: "Trung bình",
      why: "Độ sáng chênh lệch lớn giữa ca ngày/đêm, bóng râm di chuyển hoặc ánh sáng chớp do hàn/cắt có thể gây cảnh báo giả (false alarm).",
      control: "Thu thập tập dữ liệu huấn luyện (training dataset) bao quát đầy đủ tất cả các khung giờ và điều kiện thời tiết. Fine-tune mô hình AI riêng biệt và cấu hình thời gian trễ kiểm tra (debounce rule)."
    },
    {
      title: "Mất kết nối luồng RTSP",
      impact: "Cao",
      why: "Sự cố mất kết nối mạng, gián đoạn truyền tải luồng video RTSP tạo ra lỗ hổng giám sát và lỗi hệ thống.",
      control: "Thiết lập cơ chế kiểm tra định kỳ (health-check) tự động trên AI Server. Tự động gửi lệnh reconnect, phân tách luồng truyền tải sang phân vùng mạng camera (VLAN 10) riêng biệt, sử dụng switch managed."
    },
    {
      title: "GPU/Server quá tải",
      impact: "Cao",
      why: "Nhiều stream camera phân tích đồng thời làm đầy VRAM, gây sụt giảm khung hình (FPS) hoặc tăng độ trễ xử lý sự kiện.",
      control: "Khuyên dùng card NVIDIA L4 24GB. Ứng dụng công nghệ DeepStream batching gộp luồng tối ưu, cấu hình giảm FPS phân tích AI xuống 5 - 10 FPS thay vì xử lý 25 - 30 FPS thô. Thực hiện benchmark tải thực tế trước khi go-live."
    },
    {
      title: "Bão tin nhắn cảnh báo (Alert Storm)",
      impact: "Cao",
      why: "Sự cố lặp lại liên tục kích hoạt hàng loạt tin nhắn, gây quá tải cho người vận hành dẫn đến bỏ qua cảnh báo thực tế.",
      control: "Cấu hình thuật toán theo dấu (tracking ID) của nvtracker, kết hợp bộ lọc Rule Engine thiết lập thời gian chờ (cooldown) và tự động gộp sự kiện trùng lặp trong cùng một khoảng thời gian."
    },
    {
      title: "NAS đầy hoặc lỗi ổ đĩa cứng",
      impact: "Cao",
      why: "Hết không gian ghi hình cuốn chiếu hoặc hỏng đĩa làm mất video và tệp bằng chứng sự kiện quan trọng.",
      control: "Thiết lập cấu hình RAID 6 bảo vệ ổ đĩa. Cài đặt chính sách tự động xóa video cuốn chiếu (retention policy) sau 30 ngày và cấu hình Prometheus Alertmanager cảnh báo khi dung lượng trống còn dưới 15%."
    },
    {
      title: "Quy định pháp lý & sinh trắc học (Face)",
      impact: "Cao",
      why: "Module chấm công khuôn mặt xử lý dữ liệu cá nhân nhạy cảm, dễ gặp rủi ro pháp lý về bảo mật thông tin sinh trắc học.",
      control: "Chỉ thu thập dữ liệu khi có sự đồng thuận rõ ràng (Consent) của công nhân. Phân quyền truy cập dữ liệu chặt chẽ cho bộ phận HR, tự động mã hóa lưu trữ và ghi nhận nhật ký hệ thống (audit log) đầy đủ."
    },
    {
      title: "Nợ kỹ thuật (Tech Debt) sau prototype",
      impact: "Trung bình",
      why: "Sử dụng mã nguồn thử nghiệm chắp vá bằng OpenCV/CPU-only chạy tốt ở quy mô 1 camera nhưng không thể mở rộng quy mô lớn.",
      control: "Định hình chuẩn kiến trúc enterprise ngay từ đầu: container hóa (Docker/K3s), tách biệt hoàn toàn pipeline xử lý video AI khỏi tầng backend nghiệp vụ và dịch vụ gửi tin nhắn cảnh báo."
    }
  ];

  return (
    <SectionShell id="risk-control-matrix" isActive={isActive}>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] tracking-tight">
          Ma Trận Rủi Ro & Biện Pháp Kiểm Soát
        </h2>
        <p className="text-[var(--body)] text-sm mt-1">
          Bảng nhận diện các rủi ro kỹ thuật chính trong quá trình triển khai VMS247 và biện pháp kiểm soát tương ứng.
        </p>
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pr-1 max-h-[calc(100svh-280px)]"
        data-section-nav-ignore="true"
      >
        {risks.map((item, idx) => (
          <GlassCard key={idx} className="p-4 border border-[var(--hairline)] flex flex-col justify-between" hoverGlow={false}>
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xs font-bold text-[var(--ink)] font-mono leading-tight">
                  {idx + 1}. {item.title}
                </h3>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[var(--radius-pill)] whitespace-nowrap ${
                  item.impact === "Cao"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-yellow-500/10 text-yellow-600"
                }`}>
                  {item.impact}
                </span>
              </div>
              
              <div className="text-[11px] text-[var(--body)] space-y-1.5 mb-3 leading-relaxed">
                <div>
                  <span className="font-semibold text-[var(--ink)] flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" /> Rủi ro chi tiết:
                  </span>
                  <p>{item.why}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--hairline)] pt-2.5 mt-auto">
              <span className="font-semibold text-[var(--ink)] text-[11px] flex items-center gap-1 mb-1">
                <CheckSquare className="h-3 w-3 text-green-500" /> Biện pháp kiểm soát:
              </span>
              <p className="text-[11px] text-[var(--body)] leading-relaxed italic">
                {item.control}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionShell>
  );
};
