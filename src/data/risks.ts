import type { RiskItem } from '../types';

export const risksData: RiskItem[] = [
  {
    id: 1,
    title: 'Camera hiện hữu không đủ rõ',
    impact: 'High',
    whyItMatters: 'Mô hình AI rất khó nhận diện chính xác trang thiết bị bảo hộ (mũ, áo vest), nhận diện khuôn mặt chấm công hoặc phát hiện vi phạm nếu camera đặt ở góc quá xa, quá cao hoặc trong khu vực thiếu sáng nghiêm trọng.',
    control: 'Tiến hành khảo sát, đo đạc chất lượng từng camera hiện hữu. Kiểm tra độ ổn định luồng RTSP, độ phân giải thực tế, góc nhìn và điều kiện ánh sáng. Chỉ đề xuất thay thế camera mới tại các vị trí ROI trọng yếu không đạt tiêu chuẩn kỹ thuật tối thiểu.'
  },
  {
    id: 2,
    title: 'Ánh sáng thay đổi mạnh theo ca',
    impact: 'Medium',
    whyItMatters: 'Sự chênh lệch ánh sáng lớn giữa ca ngày và ca đêm, bóng râm di chuyển trong ngày, hoặc ánh lửa hàn cắt phát sinh đột xuất có thể làm giảm độ tin cậy của thuật toán AI, gây ra các cảnh báo giả (false alarms).',
    control: 'Thu thập dữ liệu mẫu đa dạng trong nhiều khung giờ và điều kiện ánh sáng khác nhau tại nhà máy để huấn luyện/fine-tune mô hình AI. Thiết lập bộ quy tắc logic nghiệp vụ có cơ chế trễ (debounce) kiểm chứng trước khi phát cảnh báo.'
  },
  {
    id: 3,
    title: 'RTSP mất kết nối đột ngột',
    impact: 'High',
    whyItMatters: 'Mất kết nối luồng stream tạo ra các khoảng trống mù giám sát, khiến hệ thống không thể phát hiện vi phạm hay sự cố an toàn trong thời gian đó.',
    control: 'Xây dựng dịch vụ giám sát tự động trạng thái camera (Health-check service). Nếu phát hiện mất luồng, hệ thống tự động khởi tạo kết nối lại (auto-reconnect). Thiết kế mạng VLAN camera riêng biệt và sử dụng Managed Switch giúp kiểm tra lỗi cổng vật lý.'
  },
  {
    id: 4,
    title: 'GPU/Server bị quá tải tài nguyên',
    impact: 'High',
    whyItMatters: 'Khi số lượng camera phân tích đồng thời tăng cao, GPU có thể bị quá nhiệt, hết VRAM hoặc CPU bị thắt cổ chai, dẫn đến giảm tốc độ khung hình xử lý (FPS drop) và trễ thời gian đưa ra cảnh báo.',
    control: 'Sử dụng dòng GPU chuyên dụng NVIDIA L4 và framework NVIDIA DeepStream để gom batch luồng thông minh. Thiết lập tần suất phân tích AI hợp lý ở mức 5-10 FPS/camera thay vì chạy tối đa 25-30 FPS. Thực hiện benchmark thực tế trước khi Go-live.'
  },
  {
    id: 5,
    title: 'Hiện tượng bão cảnh báo (Alert storm)',
    impact: 'High',
    whyItMatters: 'Hệ thống liên tục phát ra hàng trăm cảnh báo trùng lặp từ một sự kiện (ví dụ: công nhân đứng vùng cấm nhiều phút), làm người vận hành mệt mỏi và dễ bỏ sót các cảnh báo khẩn cấp thực sự khác.',
    control: 'Cấu hình thời gian chờ cảnh báo lặp (cooldown period) độc lập cho từng camera và từng sự kiện. Nhóm các cảnh báo liên quan theo đối tượng (nhờ Object Tracking) và thiết lập mức độ nghiêm trọng (Severity levels) rõ ràng.'
  },
  {
    id: 6,
    title: 'NAS bị đầy dung lượng hoặc hỏng đĩa',
    impact: 'High',
    whyItMatters: 'Không ghi được luồng video mới 24/7 hoặc làm mất mát các dữ liệu clip/ảnh bằng chứng vi phạm phục vụ cho công tác HSE sau này.',
    control: 'Thiết lập cấu hình đĩa cứng dự phòng RAID 6 chịu lỗi 2 ổ đĩa đồng thời. Cài đặt chính sách xóa cuốn chiếu video cũ tự động sau 30 ngày (Retention policy). Giám sát dung lượng ổ đĩa qua Alertmanager và thực hiện backup cơ sở dữ liệu định kỳ.'
  },
  {
    id: 7,
    title: 'Module chấm công khuôn mặt vi phạm bảo mật',
    impact: 'High',
    whyItMatters: 'Việc thu thập và lưu trữ thông tin sinh trắc học nhân viên mà không có biện pháp bảo vệ chặt chẽ có thể vi phạm các quy định pháp luật về bảo vệ dữ liệu cá nhân (ví dụ: Nghị định 13/2023/NĐ-CP).',
    control: 'Bắt buộc thu thập bản ký cam kết đồng thuận (consent) của nhân viên trước khi áp dụng. Mã hóa thông tin vector khuôn mặt trong database, thiết lập phân quyền truy cập cực kỳ nghiêm ngặt, ghi audit log chi tiết và có chính sách xóa dữ liệu rõ ràng.'
  },
  {
    id: 8,
    title: 'Nợ kỹ thuật (Technical debt) sau bản demo',
    impact: 'Medium',
    whyItMatters: 'Bản prototype phát triển vội vàng để chạy được có thể sử dụng cấu trúc mã nguồn nguyên khối, khó mở rộng khi cần thêm camera hoặc thêm tính năng AI mới.',
    control: 'Tuân thủ kiến trúc phân lớp chuẩn doanh nghiệp ngay từ đầu: đóng gói ứng dụng bằng Docker Container, tách biệt luồng xử lý video AI (Video Pipeline) khỏi luồng xử lý nghiệp vụ/thông báo thông qua Event Bus (NATS/Redis Stream).'
  }
];
