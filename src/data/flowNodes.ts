export interface FlowNode {
  id: number;
  macroGroup: "camera" | "ingest" | "ai-server" | "event" | "storage" | "dashboard";
  lane: 'Video Data Plane' | 'Event & Business Plane' | 'Storage & Evidence Plane';
  displayTitle: string;
  technicalTitle: string;
  shortLabel: string;
  simpleDescription: string;
  input: string;
  process: string;
  output: string;
  keyTech: string;
  whyNeeded: string;
  riskNote: string;
  pilotRecommendation: string;
}

export const flowNodes: FlowNode[] = [
  {
    id: 1,
    macroGroup: "camera",
    lane: "Video Data Plane",
    displayTitle: "Camera",
    technicalTitle: "IP Camera / RTSP",
    shortLabel: "Camera",
    simpleDescription: "Camera hiện hữu là điểm thu thập hình ảnh thực tế từ nhà xưởng. Camera không chạy AI, mà chỉ ghi hình và truyền video về server.",
    input: "Hình ảnh thực tế tại xưởng: công nhân, máy móc, vùng cấm, PPE, khói/lửa.",
    process: "Camera ghi nhận hình ảnh và mã hóa thành luồng video.",
    output: "Luồng video H.264/H.265.",
    keyTech: "IP Camera, RTSP, ONVIF Profile S.",
    whyNeeded: "Đây là nguồn dữ liệu đầu tiên của toàn bộ hệ thống.",
    riskNote: "Camera quá xa, thiếu sáng, góc nhìn xấu hoặc mất mạng sẽ làm AI khó nhận diện.",
    pilotRecommendation: "Tận dụng camera hiện hữu, chỉ thay thế camera có góc nhìn hoặc chất lượng ảnh không đạt."
  },
  {
    id: 2,
    macroGroup: "ingest",
    lane: "Video Data Plane",
    displayTitle: "Nhận luồng",
    technicalTitle: "RTSP / ONVIF",
    shortLabel: "Nhận luồng",
    simpleDescription: "AI Server kết nối tới từng camera để lấy luồng video về xử lý trong mạng nội bộ.",
    input: "RTSP URL, tài khoản camera, cấu hình stream.",
    process: "Xác thực camera, mở kết nối và lấy luồng video về AI Server.",
    output: "Luồng video đi vào pipeline xử lý.",
    keyTech: "RTSP, ONVIF Profile S, Camera Adapter.",
    whyNeeded: "Không có bước này, server không thể lấy hình từ camera hiện hữu.",
    riskNote: "Sai tài khoản, luồng video chập chờn, jitter mạng hoặc camera mất kết nối sẽ gây mất luồng.",
    pilotRecommendation: "Cần kiểm tra sức khỏe, tự động kết nối lại và dashboard trạng thái cho từng camera."
  },
  {
    id: 3,
    macroGroup: "ai-server",
    lane: "Video Data Plane",
    displayTitle: "Giải mã video",
    technicalTitle: "NVDEC / nvv4l2decoder",
    shortLabel: "3 Decode",
    simpleDescription: "Video từ camera đang ở dạng nén. Hệ thống cần giải mã để AI có thể phân tích từng khung hình.",
    input: "Luồng video H.264/H.265.",
    process: "Dùng phần cứng GPU để giải mã video nhanh hơn và giảm tải CPU.",
    output: "Frame ảnh đã giải mã trong bộ nhớ GPU.",
    keyTech: "NVIDIA NVDEC, nvv4l2decoder.",
    whyNeeded: "AI không thể chạy trực tiếp trên video nén.",
    riskNote: "Nếu bitrate/FPS quá cao hoặc quá nhiều stream, tầng decode có thể nghẽn.",
    pilotRecommendation: "Chỉ cần AI phân tích khoảng 5–10 FPS/camera, không nhất thiết 25–30 FPS."
  },
  {
    id: 4,
    macroGroup: "ai-server",
    lane: "Video Data Plane",
    displayTitle: "Gom luồng",
    technicalTitle: "DeepStream",
    shortLabel: "Gom luồng",
    simpleDescription: "Hệ thống gom nhiều luồng camera lại để xử lý hiệu quả hơn trên GPU.",
    input: "Frame từ nhiều camera.",
    process: "Đồng bộ frame, gom thành batch và chuẩn bị dữ liệu cho suy luận AI.",
    output: "Batch frame sẵn sàng cho model AI.",
    keyTech: "NVIDIA DeepStream, GStreamer, nvstreammux.",
    whyNeeded: "Giúp tối ưu hiệu năng khi chạy nhiều camera cùng lúc.",
    riskNote: "Stream không ổn định có thể làm tăng độ trễ xử lý.",
    pilotRecommendation: "DeepStream nên là pipeline chính cho 18 camera triển khai on-premise."
  },
  {
    id: 5,
    macroGroup: "ai-server",
    lane: "Video Data Plane",
    displayTitle: "AI nhận diện",
    technicalTitle: "TensorRT / YOLO",
    shortLabel: "AI nhận diện",
    simpleDescription: "Đây là bước AI phân tích hình ảnh để phát hiện người, PPE, khói, lửa hoặc đối tượng liên quan.",
    input: "Batch frame đã chuẩn bị.",
    process: "Chạy model AI đã tối ưu để phát hiện và phân loại đối tượng.",
    output: "Bounding box, nhãn lớp và điểm tin cậy.",
    keyTech: "TensorRT, YOLO11/YOLO26 dạng ứng viên.",
    whyNeeded: "Đây là lõi của bài toán AI Camera.",
    riskNote: "Ánh sáng xấu, che khuất, góc camera kém sẽ làm giảm độ chính xác.",
    pilotRecommendation: "Cần đánh giá benchmark và fine-tune bằng dữ liệu camera thật tại Gia Lâm."
  },
  {
    id: 6,
    macroGroup: "ai-server",
    lane: "Video Data Plane",
    displayTitle: "Theo dõi/ROI",
    technicalTitle: "nvtracker / ROI",
    shortLabel: "Theo dõi/ROI",
    simpleDescription: "Sau khi phát hiện đối tượng, hệ thống theo dõi chuyển động và kiểm tra đối tượng có vào vùng cấm hoặc vi phạm rule không.",
    input: "Kết quả phát hiện từ model AI.",
    process: "Gán ID đối tượng, theo dõi qua nhiều frame, kiểm tra ROI và line crossing.",
    output: "Metadata theo dõi đối tượng và trạng thái vùng.",
    keyTech: "nvtracker, nvdsanalytics.",
    whyNeeded: "Phát hiện đối tượng là chưa đủ; hệ thống cần hiểu đối tượng đang đi đâu và có vi phạm khu vực không.",
    riskNote: "Theo dõi đối tượng không ổn định có thể gây cảnh báo trùng.",
    pilotRecommendation: "Dùng theo dõi đối tượng để giảm cảnh báo lặp và tăng tính chính xác nghiệp vụ."
  },
  {
    id: 7,
    macroGroup: "event",
    lane: "Event & Business Plane",
    displayTitle: "Kiểm tra rule",
    technicalTitle: "Rule Engine",
    shortLabel: "Kiểm tra rule",
    simpleDescription: "Không phải kết quả phát hiện nào cũng cần cảnh báo. Rule Engine kiểm tra điều kiện trước khi tạo sự kiện thật.",
    input: "Metadata từ AI pipeline.",
    process: "Áp dụng rule theo vùng, thời gian, số frame liên tiếp, thời gian chờ và mức nghiêm trọng.",
    output: "Sự kiện hợp lệ hoặc kết quả phát hiện bị bỏ qua.",
    keyTech: "Python Rule Engine.",
    whyNeeded: "Giảm cảnh báo sai và tránh spam cảnh báo.",
    riskNote: "Rule đặt quá nhạy sẽ gây bão cảnh báo; rule quá chặt có thể bỏ sót.",
    pilotRecommendation: "Mỗi khu vực nên có rule riêng cho PPE, vùng cấm và cháy/khói."
  },
  {
    id: 8,
    macroGroup: "event",
    lane: "Event & Business Plane",
    displayTitle: "Tạo sự kiện",
    technicalTitle: "Event Service",
    shortLabel: "Tạo sự kiện",
    simpleDescription: "Khi Rule Engine xác nhận có vi phạm, hệ thống tạo một sự kiện chính thức để lưu, hiển thị và cảnh báo.",
    input: "Sự kiện đã được Rule Engine xác nhận.",
    process: "Đóng gói thông tin sự kiện, liên kết snapshot/clip và đẩy sang các dịch vụ liên quan.",
    output: "Bản ghi sự kiện.",
    keyTech: "FastAPI, NATS JetStream nếu cần tách luồng sự kiện.",
    whyNeeded: "Chuẩn hóa dữ liệu sự kiện và tách tầng AI khỏi tầng nghiệp vụ.",
    riskNote: "Nếu Event Service bị nghẽn, dashboard và cảnh báo sẽ chậm.",
    pilotRecommendation: "Event Service không được làm nghẽn pipeline suy luận AI."
  },
  {
    id: 9,
    macroGroup: "event",
    lane: "Event & Business Plane",
    displayTitle: "Lưu lịch sử",
    technicalTitle: "PostgreSQL",
    shortLabel: "Lưu lịch sử",
    simpleDescription: "Sự kiện được lưu lại để người dùng có thể tìm kiếm, lọc, thống kê và truy xuất sau này.",
    input: "Metadata sự kiện.",
    process: "Lưu camera, thời gian, module, mức nghiêm trọng, rule, trạng thái xử lý và đường dẫn bằng chứng.",
    output: "Lịch sử sự kiện có thể tra cứu.",
    keyTech: "PostgreSQL.",
    whyNeeded: "Cần database để phục vụ dashboard, báo cáo và audit log.",
    riskNote: "Không nên lưu toàn bộ metadata từng frame vì DB sẽ rất nặng.",
    pilotRecommendation: "Chỉ lưu sự kiện quan trọng và dữ liệu cần cho vận hành."
  },
  {
    id: 10,
    macroGroup: "dashboard",
    lane: "Event & Business Plane",
    displayTitle: "Gửi cảnh báo",
    technicalTitle: "Zalo / SMS / Email",
    shortLabel: "Gửi cảnh báo",
    simpleDescription: "Sau khi có sự kiện hợp lệ, hệ thống gửi cảnh báo tới người phụ trách qua các kênh phù hợp.",
    input: "Payload sự kiện.",
    process: "Gửi thông báo theo rule qua Zalo, SMS hoặc Email.",
    output: "Người vận hành/HSE/quản lý nhận cảnh báo.",
    keyTech: "Zalo OA/ZNS API, SMS API, Email Gateway.",
    whyNeeded: "Mục tiêu của hệ thống là cảnh báo sớm, không chỉ lưu lại để xem sau.",
    riskNote: "Nhà cung cấp lỗi, giới hạn tần suất hoặc mất internet có thể làm gửi cảnh báo thất bại.",
    pilotRecommendation: "Nên thiết kế gateway đa kênh, không hard-code một nhà cung cấp duy nhất."
  },
  {
    id: 11,
    macroGroup: "dashboard",
    lane: "Event & Business Plane",
    displayTitle: "Dashboard",
    technicalTitle: "API / PWA",
    shortLabel: "Dashboard",
    simpleDescription: "Dashboard lấy dữ liệu từ API để hiển thị camera, sự kiện, bằng chứng và trạng thái xử lý cho người vận hành.",
    input: "Sự kiện, trạng thái camera và đường dẫn bằng chứng.",
    process: "Cung cấp dữ liệu cho web dashboard/PWA.",
    output: "Giao diện vận hành theo thời gian thực.",
    keyTech: "FastAPI hoặc NestJS.",
    whyNeeded: "Người vận hành cần một nơi để xem live view, sự kiện và bằng chứng.",
    riskNote: "Nếu gộp luồng live video và API sự kiện không tối ưu, dashboard có thể chậm.",
    pilotRecommendation: "Nên tách đường live video khỏi API sự kiện."
  },
  {
    id: 12,
    macroGroup: "storage",
    lane: "Storage & Evidence Plane",
    displayTitle: "Lưu video",
    technicalTitle: "NAS / RAID 6",
    shortLabel: "Lưu video",
    simpleDescription: "Video gốc hoặc video segment được lưu trên NAS để xem lại khi cần.",
    input: "Luồng video hoặc phân đoạn video.",
    process: "Lưu video theo chính sách lưu giữ.",
    output: "Kho lưu trữ video.",
    keyTech: "NAS, RAID 6, NFS/SMB.",
    whyNeeded: "Video gốc giúp kiểm tra toàn bộ bối cảnh khi có sự cố.",
    riskNote: "NAS đầy hoặc lỗi ổ cứng sẽ ảnh hưởng đến lưu trữ.",
    pilotRecommendation: "Dùng NAS RAID 6, theo dõi dung lượng và sức khỏe ổ đĩa thường xuyên."
  },
  {
    id: 13,
    macroGroup: "storage",
    lane: "Storage & Evidence Plane",
    displayTitle: "Lưu bằng chứng",
    technicalTitle: "MinIO",
    shortLabel: "Lưu bằng chứng",
    simpleDescription: "Hệ thống lưu snapshot và clip ngắn của sự kiện để người dùng xem nhanh bằng chứng.",
    input: "Snapshot và clip sự kiện.",
    process: "Lưu bằng chứng dạng object và liên kết với sự kiện trong database.",
    output: "URL bằng chứng hoặc tham chiếu object.",
    keyTech: "MinIO S3-compatible object storage.",
    whyNeeded: "Người vận hành thường cần xem nhanh ảnh/clip sự kiện, không cần mở cả video dài.",
    riskNote: "Nếu object storage lỗi, sự kiện còn nhưng bằng chứng có thể không truy cập được.",
    pilotRecommendation: "Bằng chứng nên có thời gian lưu giữ dài hơn video 24/7 thông thường."
  },
  {
    id: 14,
    macroGroup: "storage",
    lane: "Storage & Evidence Plane",
    displayTitle: "Sao lưu",
    technicalTitle: "Chính sách sao lưu",
    shortLabel: "Sao lưu",
    simpleDescription: "Hệ thống cần chính sách lưu bao lâu, xóa khi nào và backup dữ liệu nào để có thể khôi phục khi có sự cố.",
    input: "DB dump, cấu hình, model, bằng chứng và log quan trọng.",
    process: "Sao lưu định kỳ, xóa cuốn chiếu dữ liệu cũ, bảo vệ dữ liệu quan trọng.",
    output: "Trạng thái hệ thống có thể khôi phục.",
    keyTech: "Backup job, backup mã hóa, chính sách lưu giữ.",
    whyNeeded: "RAID không phải backup; xóa nhầm hoặc lỗi logic vẫn có thể làm mất dữ liệu.",
    riskNote: "Không có backup riêng sẽ rủi ro khi NAS lỗi, ransomware hoặc thao tác nhầm.",
    pilotRecommendation: "Sao lưu DB/cấu hình/model/bằng chứng; không nhất thiết sao lưu toàn bộ video thô 24/7."
  }
];
